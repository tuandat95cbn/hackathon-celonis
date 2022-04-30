import pandas as pd
import pm4py as pm

eventlog = pd.read_csv (r"data\running-example.csv")
eventlog.rename(columns={'ts': 'time:timestamp',
'id': 'case:concept:name', 'event': 'concept:name', 'resource': 'org:resource'}, inplace=True)
log = pm.objects.conversion.log.converter.apply(eventlog)

# from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
# from pm4py.algo.discovery.dfg import variants
# dfg = dfg_discovery.apply(log, variant=variants.native)
# print(dfg)

df = pd.DataFrame(
    [
        ("bird", "Falconiformes", 389.0),
        ("bird", "Psittaciformes", 24.0),
        ("mammal", "Carnivora", 80.2),
        ("mammal", "Carnivora", 58),
    ],
    index=["falcon", "parrot", "lion", "monkey"],
    columns=("class", "order", "max_speed"),
)

grouped = df.groupby("class")
def f(a):
    l = []
    for i in a:
        l.append(i)
    return l
x = grouped.agg(f)
print(type(x))

