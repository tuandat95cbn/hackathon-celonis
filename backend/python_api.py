from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory
import pandas as pd
import os, pathlib
import json
from flask_cors import CORS

from pm4py.objects.conversion.log import converter as log_conversion
import sys
import requests
from pycelonis import get_celonis
from pycelonis.celonis_api.pql.pql import PQL, PQLColumn

URL = ""
CEL_URL = "academic-hieu-le-rwth-aachen-de.eu-2.celonis.cloud"
TOKEN = "MjQ5MjcyNTgtZDc0Yi00MTFiLTg4ZWEtNmMyMGM1NTgxY2FlOmpUNytpZFo5RE9QTHQ4Ui94YnZpSEY3eFNyNzEzQ0x5dUN0YTd1b0hvYmx5"
DATA_POOL = "Hackathon"
DATA_MODEL = "SAP P2P"
ACTIVITY_TABLE = "_CEL_P2P_ACTIVITIES_EN_parquet"
CASE_TABLE = "EKPO_parquet"
CELONIS = get_celonis(url=CEL_URL,
    api_token=TOKEN,
    key_type='USER_KEY')

server = Flask(__name__)
CORS(server)

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
