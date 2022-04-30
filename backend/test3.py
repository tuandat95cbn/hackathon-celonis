import pandas as pd
import pm4py as pm

eventlog = pd.read_csv (r"data\running-example.csv")
eventlog.rename(columns={'ts': 'time:timestamp',
'id': 'case:concept:name', 'event': 'concept:name', 'resource': 'org:resource'}, inplace=True)
log = pm.objects.conversion.log.converter.apply(eventlog)
from pm4py.statistics.traces.generic.log import case_statistics
variants_count = case_statistics.get_variant_statistics(log)
print(len(log))

from pm4py.algo.filtering.log.variants import variants_filter
variants = variants_filter.get_variants(log)

from pm4py.algo.filtering.log.variants import variants_filter

filtered_log = variants_filter.filter_log_variants_percentage(log, percentage=0)
print(filtered_log[0])
d = ""
for key in variants:
    if filtered_log[0] in variants[key]:
        d = key
        print(type(d.split(",")))


for i in variants_count:
    if i['variant'] == d:

        print(i['count'])

# from pm4py.statistics.traces.generic.log import case_statistics
# median_case_duration = case_statistics.get_median_case_duration(log)
# print(median_case_duration)



from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
from pm4py.algo.discovery.dfg import variants
# dfg = dfg_discovery.apply(log)
# gviz = pm.visualization.dfg.visualizer.apply(dfg, log)
# pm.visualization.dfg.visualizer.view(gviz)

# df = pd.DataFrame(
#     [
#         ("bird", "Falconiformes", 389.0),
#         ("bird", "Psittaciformes", 24.0),
#         ("mammal", "Carnivora", 80.2),
#         ("mammal", "Carnivora", 58),
#     ],
#     index=["falcon", "parrot", "lion", "monkey"],
#     columns=("class", "order", "max_speed"),
# )
#
# grouped = df.groupby("class")
# def f(a):
#     l = []
#     for i in a:
#         l.append(i)
#     return l
# x = grouped.agg(f)
# print(type(x))

