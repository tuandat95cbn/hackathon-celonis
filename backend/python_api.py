from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory
import pandas as pd
import os, pathlib
import json
from flask_cors import CORS
import pm4py as pm
from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
from pm4py.algo.discovery.dfg import variants
from pm4py.objects.conversion.log import converter as log_conversion
import sys
import requests
from pycelonis import get_celonis
from pycelonis.celonis_api.pql.pql import PQL, PQLColumn, PQLFilter
from pm4py.algo.discovery.alpha import algorithm as alpha_miner
from pm4py.visualization.petri_net import visualizer as pn_visualizer

URL = ""
CEL_URL = "academic-hieu-le-rwth-aachen-de.eu-2.celonis.cloud"
TOKEN = "MjQ5MjcyNTgtZDc0Yi00MTFiLTg4ZWEtNmMyMGM1NTgxY2FlOmpUNytpZFo5RE9QTHQ4Ui94YnZpSEY3eFNyNzEzQ0x5dUN0YTd1b0hvYmx5"
DATA_POOL = "Hackathon"
DATA_MODEL = "SAP P2P"
ACTIVITY_TABLE = "_CEL_P2P_ACTIVITIES_EN_parquet"
CASE_TABLE = "EKPO_parquet"

case_table_case = '"EKPO_parquet"."_CASE_KEY"'
activity_table_case = '"_CEL_P2P_ACTIVITIES_EN_parquet"."_CASE_KEY"'
activity_table_activity = '"_CEL_P2P_ACTIVITIES_EN_parquet"."ACTIVITY_EN"'
activity_table_timestamp = '"_CEL_P2P_ACTIVITIES_EN_parquet"."EVENTTIME"'
activity_table_user_type = '"_CEL_P2P_ACTIVITIES_EN_parquet"."USER_TYPE"'

CELONIS = get_celonis(url=CEL_URL,
    api_token=TOKEN,
    key_type='USER_KEY')

server = Flask(__name__)
CORS(server)


@server.route(URL + '/test', methods=['GET'])
def test():
    cluster_per_case = PQL()
    cluster_per_case += PQLColumn(case_table_case, "case_id")
    cluster_per_case += PQLColumn(f'VARIANT ( {activity_table_activity} )', "variant")
    cluster_per_case += PQLColumn(
        f'CLUSTER_VARIANTS ( VARIANT ( {activity_table_activity} ), 2, 2 ) ', "cluster_id"
    )
    data_model = CELONIS.datamodels.find(DATA_MODEL)
    df = data_model._get_data_frame(cluster_per_case)
    df.to_csv(r"C:\Users\HOANG-ANH-MEED\Desktop\hack\cluster4.csv")
    return ""




@server.route(URL + '/cluster-further/<selected_cluster_id>', methods=['GET'])
def get_second_cluster(selected_cluster_id):
    first_cluster = f'CLUSTER_VARIANTS( VARIANT ( {activity_table_activity} ), 2, 2 ) '
    activities_for_the_selected_cluster = f'''
      CASE WHEN
        {first_cluster} = {selected_cluster_id}
      THEN
        {activity_table_activity}
      ELSE
        NULL
      END
    '''
    drilldown_query = PQL()
    drilldown_query += PQLColumn(case_table_case, "case_id")
    drilldown_query += PQLColumn(f'VARIANT ( {activities_for_the_selected_cluster} )', "variant")
    drilldown_query += PQLColumn(f'{first_cluster}', "cluster_1")
    drilldown_query += PQLColumn(f'CLUSTER_VARIANTS ( VARIANT ( {activities_for_the_selected_cluster} ) , 2, 2)',
                                 "cluster_")
    drilldown_query += PQLFilter(f'FILTER {first_cluster} = {selected_cluster_id}')
    data_model = CELONIS.datamodels.find(DATA_MODEL)
    df = data_model._get_data_frame(drilldown_query)
    df.to_csv(r"C:\Users\HOANG-ANH-MEED\Desktop\hack\cluster4.csv")

    print(df)

    return ""



@server.route(URL + '/cluster-dfg', methods=['POST'])
def get_cluster_dfg():
    df = get_cluster_table()
    df.rename(columns={"_TIME": 'time:timestamp',
                             "_CASE": 'case:concept:name', "_ACT_EN": 'concept:name', "_USER": 'org:resource'},
                    inplace=True)
    log = pm.objects.conversion.log.converter.apply(df)

    dfg = dfg_discovery.apply(log, variant=variants.native)

    net, im, fm = alpha_miner.apply(log)


    gviz = pn_visualizer.apply(net, im, fm)
    pn_visualizer.view(gviz)
    return ""


@server.route(URL + '/cluster-table', methods=['POST'])
def get_cluster_table():
    cases = request.get_json()
    q_cases = f'FILTER {ACTIVITY_TABLE}."_CASE_KEY" IN ('
    for i in range(0, len(cases)):
        if i == len(cases) - 1:
            q_cases += "'"
            q_cases += cases[i]
            q_cases += "'"
        else:
            q_cases += "'"
            q_cases += cases[i]
            q_cases += "'"
            q_cases += ','
    q_cases += ');'
    query = PQL()
    fi = PQLFilter(q_cases)
    col1 = PQLColumn(activity_table_case, "_CASE")
    col2 = PQLColumn(activity_table_activity, "_ACT_EN")
    col3 = PQLColumn(activity_table_timestamp, "_TIME")
    col4 = PQLColumn(activity_table_user_type, "_USER")
    query += col1
    query += col2
    query += col3
    query += col4
    query += fi

    data_model = CELONIS.datamodels.find(DATA_MODEL)
    df = data_model._get_data_frame(query)

    return df

@server.route(URL + '/table/add-column/<cluster_column>', methods=['POST'])
def add_column(cluster_column):
    json_list=request.get_json()
    column_queries = []
    column2 = PQLColumn(
        query='CLUSTER_VARIANTS ( VARIANT ("' + ACTIVITY_TABLE + '"."' + cluster_column + '" ), 2 , 2 )',
        name="cluster")
    column_queries.append(column2)
    for js in json_list:
        table = js['table']
        column = js['column']
        action = js['action']
        if action == "agg":
            column3 = PQLColumn(
                query='PU_STRING_AGG ( "' + CASE_TABLE + '", "' + table + '"."' + column + '" , \'-\' )', name=column)
            column_queries.append(column3)
        elif action == "avg":
            column3 = PQLColumn(query='PU_AVG ( "' + CASE_TABLE + '" , "' + table + '"."' + column + '" )', name=column)
            column_queries.append(column3)
        elif action == "sum":
            column3 = PQLColumn(query='PU_SUM ( "' + CASE_TABLE + '" , "' + table + '"."' + column + '" )', name=column)
            column_queries.append(column3)
        elif action == "":
            column1 = PQLColumn(query='"' + table + '"."' + column + '"', name='Case_ID')
            column_queries.append(column1)

    query = PQL()
    data_model = CELONIS.datamodels.find(DATA_MODEL)
    # column1 = PQLColumn(query='"' + CASE_TABLE + '"."_CASE_KEY"', name='Case_ID')

    for i in column_queries:
        query += i

    df = data_model._get_data_frame(query)
    grouped = df.groupby("cluster")

    def f(a):
        l = []
        for i in a:
            l.append(i)
        return l

    x = grouped.agg(f)
    print(x)
    response = server.response_class(
        response=json.dumps(x.to_dict(), sort_keys=False),
        status=200,
        mimetype='application/json'
    )
    return response


@server.route(URL + '/table/cluster/<col_name>', methods=['GET'])
def get_cluster(col_name):
    query = PQL()
    data_model = CELONIS.datamodels.find(DATA_MODEL)
    column1 = PQLColumn(query='"' + CASE_TABLE + '"."_CASE_KEY"', name='Case_ID')
    column2 = PQLColumn(query='CLUSTER_VARIANTS ( VARIANT ("' + ACTIVITY_TABLE + '"."' + col_name + '" ), 2 , 2 )',
                        name="cluster")

    query += column1
    query += column2

    df = data_model._get_data_frame(query)
    grouped = df.groupby("cluster")

    def f(a):
        l = []
        for i in a:
            l.append(i)
        return l

    x = grouped.agg(f)
    print(x.index)
    response = server.response_class(
        response=json.dumps(x.to_dict(), sort_keys=False),
        status=200,
        mimetype='application/json'
    )
    return response


@server.route('/table/columns', methods=['GET'])
def get_col_by_name():

    data_model = CELONIS.datamodels.find(DATA_MODEL)
    tables = data_model.tables.find(ACTIVITY_TABLE)

    res = []
    for col in tables.columns:
        if col['type'] == "STRING":
            res.append(col['name'])

    response = server.response_class(
        response=json.dumps(res, sort_keys=False),
        status=200,
        mimetype='application/json'
    )
    return response


@server.route('/table', methods=['GET'])
def get_tables():

    data_model = CELONIS.datamodels.find(DATA_MODEL)
    # print(data_model.tables[0].alias())
    print(data_model)
    res = []
    for table in data_model.tables:
        res.append(table.name)
    response = server.response_class(
        response=json.dumps(res, sort_keys=False),
        status=200,
        mimetype='application/json'
    )
    return response






if __name__ == '__main__':
    server.run(debug=True)
