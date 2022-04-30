from pycelonis import pql

from pycelonis import get_celonis
from pycelonis.celonis_api.event_collection import compute_node
celonis = get_celonis(url="academic-hieu-le-rwth-aachen-de.eu-2.celonis.cloud/",
    api_token="MjQ5MjcyNTgtZDc0Yi00MTFiLTg4ZWEtNmMyMGM1NTgxY2FlOmpUNytpZFo5RE9QTHQ4Ui94YnZpSEY3eFNyNzEzQ0x5dUN0YTd1b0hvYmx5",
    key_type='USER_KEY')
from pycelonis.celonis_api.pql.pql import PQLColumn


analysis = celonis.analyses.find('3aae13b4-da2d-4f11-98f1-9f73e4e5295d')
query = analysis.draft.components.find("hack2").pql_query
column1 = PQLColumn(query = 'CLUSTER_VARIANTS ( VARIANT ("_CEL_P2P_ACTIVITIES_EN_parquet"."ACTIVITY_EN" ), 2 , 2 )', name="cluster")
column2 = PQLColumn(query = 'CLUSTER_VARIANTS ( VARIANT ( BIND ( "_CEL_P2P_ACTIVITIES_EN_parquet", "EKPO_parquet"."MANDT") ), 2 , 2 )', name="cluster")

column3 = PQLColumn(query = '"_CEL_P2P_ACTIVITIES_EN_parquet"."_CASE_KEY"', name="case")
query.add(column1)
query.add(column2)
query.add(column3)
df = analysis.get_data_frame(query)
df.to_csv(r"C:\Users\HOANG-ANH-MEED\Desktop\hack\cluster3.csv")

print(df.head())