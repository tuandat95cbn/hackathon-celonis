from flask import Flask, render_template, request, flash, redirect, url_for, send_file
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
from pm4py.statistics.traces.generic.log import case_statistics
from pm4py.algo.filtering.log.variants import variants_filter
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


# @server.route(URL + '/stat/case-per-cluster', methods=['GET'])
# def get_case_per_cluster():
#     a = PQL()
#     a += PQLColumn(case_table_case, "case_id")
#     a += PQLColumn(f'VARIANT ( {activity_table_activity} )', "variant")
#     a += PQLColumn(
#         f'CLUSTER_VARIANTS ( VARIANT ( {activity_table_activity} ), 2, 2 ) ', "cluster_id"
#     )
#     data_model = CELONIS.datamodels.find(DATA_MODEL)
#     df = data_model._get_data_frame(cluster_per_case)
#     df.to_csv(r"C:\Users\HOANG-ANH-MEED\Desktop\hack\cluster4.csv")
#     return ""


@server.route(URL + '/test', methods=['GET'])
def test():
    a = PQL()
    a += PQLColumn(f"ESTIMATE_CLUSTER_PARAMS ( VARIANT ( {activity_table_activity} ), 3, 5, 3 )")
    data_model = CELONIS.datamodels.find(DATA_MODEL)
    df = data_model._get_data_frame(a)
    return ""


@server.route(URL + '/stat/basic', methods=['POST'])
def get_basic_stat():
    df = get_cluster_table()
    df.rename(columns={"_TIME": 'time:timestamp',
                       "_CASE": 'case:concept:name', "_ACT_EN": 'concept:name', "_USER": 'org:resource'},
              inplace=True)
    log = pm.objects.conversion.log.converter.apply(df)
    ev = len(df)
    ca = len(log)
    va = len(case_statistics.get_variant_statistics(log))

    return {"cases": ca, "variants": va, "events": ev}


@server.route(URL + '/stat/most-com-var', methods=['POST'])
def get_most_common_var():
    df = get_cluster_table()
    df.rename(columns={"_TIME": 'time:timestamp',
                       "_CASE": 'case:concept:name', "_ACT_EN": 'concept:name', "_USER": 'org:resource'},
              inplace=True)
    log = pm.objects.conversion.log.converter.apply(df)

    variants = variants_filter.get_variants(log)
    mo_var = variants_filter.filter_log_variants_percentage(log, percentage=0)
    d = ""
    for key in variants:
        if mo_var[0] in variants[key]:
            d = key
    variants_count = case_statistics.get_variant_statistics(log)
    gg = 0;
    for i in variants_count:
        if i['variant'] == d:
            gg = i['count']
    return {"variant": d.split(","), "count": gg}


@server.route(URL + '/stat/throughput', methods=['POST'])
def get_throughput_time():
    cases = request.get_json()
    throughput_per_cluster = PQL()
    throughput_per_cluster += PQLColumn(
        f'{case_table_case}', "case_ID"
    )
    throughput_per_cluster += PQLColumn(
        f'AVG ('
        f'  CALC_THROUGHPUT ( '
        f'      CASE_START TO CASE_END, '
        f'      REMAP_TIMESTAMPS ( {activity_table_timestamp}, MINUTES ) '
        f'  ) '
        f')',
        "avg_throughput_time"
    )
    q_cases = f'FILTER {CASE_TABLE}."_CASE_KEY" IN ('
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
    throughput_per_cluster += PQLFilter(q_cases)
    data_model = CELONIS.datamodels.find(DATA_MODEL)
    df = data_model._get_data_frame(throughput_per_cluster)

    response = server.response_class(
        response=json.dumps(df.to_dict(), sort_keys=False),
        status=200,
        mimetype='application/json'
    )
    return response



@server.route(URL + '/table/cluster/<col_name>', methods=['GET'])
def get_cluster(col_name):
    query = PQL()
    data_model = CELONIS.datamodels.find(DATA_MODEL)
    column1 = PQLColumn(query='"' + CASE_TABLE + '"."_CASE_KEY"', name='Case_ID')
    column2 = PQLColumn(query='CLUSTER_VARIANTS ( VARIANT ("' + ACTIVITY_TABLE + '"."' + col_name + '" ), 700 , 2 )',
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

@server.route(URL + '/cluster-further/<column_name>', methods=['POST'])
def get_second_cluster(column_name):
    cluster_hira=request.get_json()
    cluster_querys=[]
    activities_selected_queries=[]
    activities_query = f'''
        CASE WHEN '''
    first=True
    for cluster in cluster_hira:
        if first:
            first=False
        else:
            activities_query+=" AND "
        table_col_name='"'+ACTIVITY_TABLE+'".'+'"'+cluster['column']+'"'
        cluster_q = f'CLUSTER_VARIANTS( VARIANT ( {table_col_name} ), 2, 2 ) '

        activities_query+=f"{cluster_q} = {cluster['cluster_id']}"
        cluster_querys.append(cluster_q)
    activities_query+=f'''
        THEN
        {'"'+ACTIVITY_TABLE+'".'+'"'+column_name+'"'}
      ELSE
        NULL
      END
    '''
    drilldown_query = PQL()
    drilldown_query += PQLColumn(case_table_case, "case_id")
    drilldown_query += PQLColumn(f'VARIANT ( {activities_query} )', column_name)
    for i in range(len(cluster_querys)):
        drilldown_query += PQLColumn(f'{cluster_querys[i]}', "cluster_"+str(i))
    drilldown_query += PQLColumn(f'CLUSTER_VARIANTS ( VARIANT ( {activities_query} ) , 2, 2)',
                                 "cluster_")
    for i in range(len(cluster_querys)):
        drilldown_query += PQLFilter(f'FILTER {cluster_querys[i]} = {cluster_hira[i]["cluster_id"]};')
    data_model = CELONIS.datamodels.find(DATA_MODEL)
    print(drilldown_query.query)
    df = data_model._get_data_frame(drilldown_query)

    response = server.response_class(
        response=json.dumps(df.to_dict(), sort_keys=False),
        status=200,
        mimetype='application/json'
    )

    return response



@server.route(URL + '/cluster-ptree', methods=['GET'])
def get_cluster_ptree():
    df = get_cluster_table()
    df.rename(columns={"_TIME": 'time:timestamp',
                             "_CASE": 'case:concept:name', "_ACT_EN": 'concept:name', "_USER": 'org:resource'},
                    inplace=True)
    log = pm.objects.conversion.log.converter.apply(df)

    net, initial_marking, final_marking = pm.algo.discovery.inductive.algorithm.apply(log)
    tree = pm.algo.discovery.inductive.algorithm.apply_tree(log)

    def build(tree):
        if tree.operator is None:
            return {"name": tree.label}
        else:
            d = {}
            op = tree.operator
            children = tree.children
            c = []
            for i in children:
                c.append(build(i))
            d['name'] = op
            d['children'] = c
            return d

    gg = build(tree)
    response = server.response_class(
        response=json.dumps(gg.to_dict(), sort_keys=False),
        status=200,
        mimetype='application/json'
    )
    return response


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





@server.route('/table/columns', methods=['GET'])
def get_col_by_name():
    args = request.args
    is_all=False
    if args!=None and "type" in args and args["type"]=="all":
        is_all=True

    data_model = CELONIS.datamodels.find(DATA_MODEL)
    tables = data_model.tables.find(ACTIVITY_TABLE)

    res = []
    for col in tables.columns:
        if not is_all:
           if col['type'] == "STRING":
                res.append(col['name'])
        else:
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
