from pycelonis import get_celonis
import pandas as pd
import pm4py.objects.log.importer.xes.importer as xes_importer
import pm4py.objects.conversion.log.converter as df_converter
import socket


class Celonis:
    def __init__(self, log, url, token):
        self.log = log
        self.url = url
        self.token = token

    def push_table(self):
        # login = {"celonis_url": self.url, "api_token": self.token}
        pass

    def get_log(self):
        return self.log


# edit profile to generate API Key
login = {
    # "celonis_url": "academic-hieu-le-rwth-aachen-de.eu-2.celonis.cloud",
    # "api_token": "YzZlZTJlNjMtOGNlNi00YzdmLTlhYjMtMWRlNmRiOWE1Y2RhOmxZTEQ3UnRteUFHMnNBQm9FUTF6allLNkpGMEdldTFlM1hZZDZjNGMwR0lG",
    "celonis_url": "hieu-le-rwth-aachen-de.training.celonis.cloud",
    "api_token": "M2M5ZWJmODItZTYzZi00ZDI5LTg3Y2QtYjY2NWY4YmFkOWY2Om9HKytLY1lZcFV6NXNSSnBGS0hNc2poUUJ0R09sbXNjTnp5Syt6VDVkZDZP",
}

# receipt import
receipt_log = xes_importer.apply(r"D:\Hiwi_PADS\vda_job\pycelonis\data\receipt.xes")
receipt_df = df_converter.apply(receipt_log, variant=df_converter.TO_DATA_FRAME)

# print(type(receipt_df))
file_path = r"D:\eclipse\proj\test\data\running-example.csv"
df = pd.read_csv(file_path)

celonis = get_celonis(**login)

data_pool = celonis.pools.find("1956bd42-c2ab-4d0a-a0ba-85346953ffa0")
# # df = pd.DataFrame({'A': [2, 4, 8, 0], 'B': [2, 0, 0, 0], 'C': [10, 2, 1, 8]})
# append_df = pd.DataFrame({'A': [91, 42], 'B': [72, 54], 'C': [80, 38]})
#
# # for table in data_pool.tables:
# #     data_pool._drop_remote_table(table_name=table['name'])
# data_pool._drop_remote_table(table_name="Demo")

# data_model = celonis.datamodels.find("f3590f25-ab26-4234-ac2d-b88c756ee813")
# data_model.add_table_from_pool(table_name="new-csv-2", alias="new-csv-2")
# print(data_model)
def payload_add_table_from_pool(connection, table_name, alias=None):
    # Add table from pool to datamodel
    url = f"https://hieu-le-rwth-aachen-de.training.celonis.cloud/integration/api/pools/1956bd42-c2ab-4d0a-a0ba-85346953ffa0/data-model/f3590f25-ab26-4234-ac2d-b88c756ee813/tables"
    payload = [{"name": table_name, "alias": alias, "dataModelId": "f3590f25-ab26-4234-ac2d-b88c756ee813", "dataSourceId": connection}]
    return url, payload

def add_table_from_pool():

    # check if table exists in pool


    # url = "https://hieu-le-rwth-aachen-de.training.celonis.cloud/integration/api/pools/1956bd42-c2ab-4d0a-a0ba-85346953ffa0/data-model/f3590f25-ab26-4234-ac2d-b88c756ee813/tables"
    # payload = {
    # "name": "new-csv-3",
    # "alias": "new-csv-3",
    # "dataModelId": "f3590f25-ab26-4234-ac2d-b88c756ee813",
    # "dataSourceId": None

    url, payload = payload_add_table_from_pool(None, "new-csv-5", "new-csv-5")
    add_table_response = celonis.api_request(url, payload)
    # Connect tables via foreign keys
    return add_table_response





add_table_from_pool()




