import json
import pandas as pd
import numpy as np
import warnings
from flask import Flask, jsonify, render_template
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn import metrics
from sklearn.manifold import MDS



warnings.filterwarnings("ignore")
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/Elbow")
def Elbow():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    cluster = 1
    elbow = []
    SSE = {}
    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(df)
    df_scaled = pd.DataFrame(data_scaled)
    while cluster < 20:
        kmeans = KMeans(n_clusters = cluster, init = 'k-means++', max_iter = 1000)
        kmeans.fit(df_scaled)
        df_scaled['clusters'] = kmeans.labels_
        SSE[cluster] = kmeans.inertia_
        cluster += 1
    elbow = pd.DataFrame(columns=["x","y"], data = elbow)
    elbow["y"] = list(SSE.values())
    elbow["x"] = list(SSE.keys())

    elbow = elbow.to_dict(orient='records')
    elbow = {'data': elbow}
    return jsonify(elbow)


@app.route("/ScreePlotForPCATotal")
def ScreePlotForPCATotal():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    scree_plot = []
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(df)
    pca = PCA(0.95)
    pca_data = pca.fit_transform(data_scaled)

    scree_plot = pd.DataFrame(columns = ["x","y"], data = scree_plot)
    scree_plot["y"]= list(pca.explained_variance_)
    scree_plot["x"] = list(range(1,10))
    scree_plot = scree_plot.to_dict(orient = 'records')
    scree_plot = {'data': scree_plot}
    return jsonify(scree_plot)

@app.route("/ScreePlotForPCA")
def ScreePlotForPCA():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    random_sampling = df.sample(frac = 0.25)
    scree_plot = []
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(random_sampling)
    pca = PCA(0.95)
    pca_data = pca.fit_transform(data_scaled)

    scree_plot = pd.DataFrame(columns = ["x","y"], data = scree_plot)
    scree_plot["y"]= list(pca.explained_variance_)
    scree_plot["x"] = list(range(1,10))
    scree_plot = scree_plot.to_dict(orient = 'records')
    scree_plot = {'data': scree_plot}
    return jsonify(scree_plot)


@app.route("/ScreePlotForPCAStratified")
def ScreePlotForPCAStratified():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    kmeans = KMeans(n_clusters = 4)
    df = df.drop(['TEAM'], axis = 1)
    kmeans = kmeans.fit(df)
    stratified_sampling = []
    scree_plot = []
    df['cluster'] = kmeans.labels_
    cluster_data_3 = df[df['cluster']==3]
    cluster_data_3 = cluster_data_3.sample(16)
    cluster_data_2 = df[df['cluster']==2]
    cluster_data_2 = cluster_data_2.sample(16)
    cluster_data_1 = df[df['cluster']==1]
    cluster_data_1 = cluster_data_1.sample(16)
    cluster_data_0 = df[df['cluster']==0]
    cluster_data_0 = cluster_data_0.sample(16)
    temp = pd.DataFrame(stratified_sampling, columns=['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed',
           'Turnover allowed', 'Turn Over Commited', 'Free Throw Shot','Free Throw Allowed', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'])
    stratified_sampling = temp.append(cluster_data_0)
    stratified_sampling = stratified_sampling.append(cluster_data_3)
    stratified_sampling = stratified_sampling.append(cluster_data_2)
    stratified_sampling = stratified_sampling.append(cluster_data_1)
    stratified_sampling = stratified_sampling.drop(['cluster'], axis = 1)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(stratified_sampling)
    pca = PCA(0.95)
    pca.fit_transform(data_scaled)
    scree_plot = pd.DataFrame(columns = ["x","y"], data = scree_plot)
    scree_plot["y"]= list(pca.explained_variance_ratio_)
    scree_plot["x"] = list(range(1,10))
    scree_plot = scree_plot.to_dict(orient = 'records')
    scree_plot = {'data': scree_plot}
    return jsonify(scree_plot)

@app.route("/ScreePlotForMDSEucTotal")
def ScreePlotForMDSEucTotal():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    scree_plot=[]
    mds_stress=[]
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(df)
    
    i = 1
    while i < 20:
        euclidean_mds = MDS(n_components = i, dissimilarity='euclidean')
        euclidean_mds.fit_transform(data_scaled)
        mds_stress.append(euclidean_mds.stress_)
        i += 1
    
    scree_plot = pd.DataFrame(columns = ["x","y"], data = scree_plot )
    scree_plot["y"] = mds_stress
    scree_plot["x"] = list(range(1,20))
    
    scree_plot = scree_plot.to_dict(orient = 'records')
    scree_plot = {'data': scree_plot}
    return jsonify(scree_plot)


@app.route("/ScreePlotForMDSEuc")
def ScreePlotForMDSEuc():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    random_sampling = df.sample(frac = 0.25)
    scree_plot=[]
    mds_stress=[]
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(random_sampling)
    
    i = 1
    while i < 20:
        euclidean_mds = MDS(n_components = i, dissimilarity='euclidean')
        euclidean_mds.fit_transform(data_scaled)
        mds_stress.append(euclidean_mds.stress_)
        i += 1
    
    scree_plot = pd.DataFrame(columns = ["x","y"], data = scree_plot )
    scree_plot["y"] = mds_stress
    scree_plot["x"] = list(range(1,20))
    
    scree_plot = scree_plot.to_dict(orient = 'records')
    scree_plot = {'data': scree_plot}
    return jsonify(scree_plot)

@app.route("/ScreePlotForMDSEucStratified")
def ScreePlotForMDSEucStratified():

    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    kmeans = KMeans(n_clusters = 4)
    df = df.drop(['TEAM'], axis = 1)
    kmeans = kmeans.fit(df)
    df["cluster"] = kmeans.labels_
    stratified_sampling = []
    mds_stress = []
    mds_plot = []
    cluster_data_3 = df[df['cluster']==3]
    cluster_data_3 = cluster_data_3.sample(16)
    cluster_data_2 = df[df['cluster']==2]
    cluster_data_2 = cluster_data_2.sample(16)
    cluster_data_1 = df[df['cluster']==1]
    cluster_data_1 = cluster_data_1.sample(16)
    cluster_data_0 = df[df['cluster']==0]
    cluster_data_0 = cluster_data_0.sample(16)
    temp = pd.DataFrame(stratified_sampling, columns=['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed',
           'Turnover allowed', 'Turn Over Commited', 'Free Throw Shot','Free Throw Allowed', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'])
    stratified_sampling = temp.append(cluster_data_0)
    stratified_sampling = stratified_sampling.append(cluster_data_3)
    stratified_sampling = stratified_sampling.append(cluster_data_2)
    stratified_sampling = stratified_sampling.append(cluster_data_1)
    stratified_sampling = stratified_sampling.drop(['cluster'], axis = 1)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(stratified_sampling)
    
    i = 1
    while i < 20:
        euclidean_mds = MDS(n_components = i, dissimilarity='euclidean')
        euclidean_mds.fit_transform(data_scaled)
        mds_stress.append(euclidean_mds.stress_)
        i += 1
    
    mds_plot = pd.DataFrame(columns = ["x","y"], data = mds_plot )
    mds_plot["y"] = mds_stress
    mds_plot["x"] = list(range(1,20))
    
    mds_plot = mds_plot.to_dict(orient = 'records')
    mds_plot = {'data': mds_plot}
    return jsonify(mds_plot)

@app.route("/ScatterPlotPCATotal")
def ScatterPlotPCATotal():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(df)
    pca = PCA(n_components = 2)
    pca_data = pca.fit_transform(data_scaled)
    scatter_plot = pd.DataFrame(columns = ['x', 'y'], data = pca_data)
    scatter_plot = scatter_plot.to_dict(orient='records')
    scatter_plot = {'data': scatter_plot}
    return jsonify(scatter_plot)

@app.route("/ScatterPlotPCA")
def ScatterPlotPCA():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    random_sampling = df.sample(frac = 0.25)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(random_sampling)
    pca = PCA(n_components = 2)
    pca_data = pca.fit_transform(data_scaled)
    scatter_plot = pd.DataFrame(columns = ['x', 'y'], data = pca_data)
    scatter_plot = scatter_plot.to_dict(orient='records')
    scatter_plot = {'data': scatter_plot}
    return jsonify(scatter_plot)

@app.route("/ScatterPlotPCAStratified")
def ScatterPlotPCAStratified():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    kmeans = KMeans(n_clusters = 4)
    df = df.drop(['TEAM'], axis = 1)
    kmeans = kmeans.fit(df)
    stratified_sampling = []
    scree_plot = []
    df["cluster"] = kmeans.labels_
    cluster_data_3 = df[df['cluster']==3]
    cluster_data_3 = cluster_data_3.sample(16)
    cluster_data_2 = df[df['cluster']==2]
    cluster_data_2 = cluster_data_2.sample(16)
    cluster_data_1 = df[df['cluster']==1]
    cluster_data_1 = cluster_data_1.sample(16)
    cluster_data_0 = df[df['cluster']==0]
    cluster_data_0 = cluster_data_0.sample(16)
    temp = pd.DataFrame(stratified_sampling, columns=['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed',
           'Turnover allowed', 'Turn Over Commited', 'Free Throw Shot','Free Throw Allowed', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'])
    stratified_sampling = temp.append(cluster_data_0)
    stratified_sampling = stratified_sampling.append(cluster_data_3)
    stratified_sampling = stratified_sampling.append(cluster_data_2)
    stratified_sampling = stratified_sampling.append(cluster_data_1)
    clusters = stratified_sampling["cluster"]
    stratified_sampling = stratified_sampling.drop(['cluster'], axis = 1)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(stratified_sampling)
    pca = PCA(n_components=2)  
    pca_data = pca.fit_transform(data_scaled) 
    pca_data = np.append(pca_data,clusters.values.reshape(64,1), axis=1)
    scree_plot = pd.DataFrame(columns = ['x', 'y','cluster'], data = pca_data )
    scree_plot = scree_plot.to_dict(orient = 'records')
    scree_plot = {'data': scree_plot}
    return jsonify(scree_plot)

@app.route("/ScatterPlotMDSTotal")
def ScatterPlotMDSTotal():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(df)
    mds_euclidean = MDS(dissimilarity = 'euclidean', n_components = 2)
    mds_data = mds_euclidean.fit_transform(data_scaled)
    mds_data_euclidean = pd.DataFrame(columns=['x', 'y'], data = mds_data)
    mds_data_euclidean = mds_data_euclidean.to_dict(orient = 'records')
    mds_data_euclidean = {'data': mds_data_euclidean}
    return jsonify(mds_data_euclidean)

@app.route("/ScatterPlotMDS")
def ScatterPlotMDS():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    random_sampling = df.sample(frac = 0.25)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(random_sampling)
    mds_euclidean = MDS(dissimilarity = 'euclidean', n_components = 2)
    mds_data = mds_euclidean.fit_transform(data_scaled)
    mds_data_euclidean = pd.DataFrame(columns=['x', 'y'], data = mds_data)
    mds_data_euclidean = mds_data_euclidean.to_dict(orient = 'records')
    mds_data_euclidean = {'data': mds_data_euclidean}
    return jsonify(mds_data_euclidean)

@app.route("/ScatterPlotMDSStratified")
def ScatterPlotMDSStratified():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    kmeans = KMeans(n_clusters = 4)
    df = df.drop(['TEAM'], axis = 1)
    kmeans = kmeans.fit(df)
    df["cluster"] = kmeans.labels_
    stratified_sampling = []
    cluster_data_3 = df[df['cluster']==3]
    cluster_data_3 = cluster_data_3.sample(16)
    cluster_data_2 = df[df['cluster']==2]
    cluster_data_2 = cluster_data_2.sample(16)
    cluster_data_1 = df[df['cluster']==1]
    cluster_data_1 = cluster_data_1.sample(16)
    cluster_data_0 = df[df['cluster']==0]
    cluster_data_0 = cluster_data_0.sample(16)
    
    temp = pd.DataFrame(stratified_sampling, columns=['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed',
           'Turnover allowed', 'Turn Over Commited', 'Free Throw Shot','Free Throw Allowed', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'])
    stratified_sampling = temp.append(cluster_data_0)
    stratified_sampling = stratified_sampling.append(cluster_data_3)
    stratified_sampling = stratified_sampling.append(cluster_data_2)
    stratified_sampling = stratified_sampling.append(cluster_data_1)
    cluster = stratified_sampling["cluster"]
    stratified_sampling = stratified_sampling.drop(['cluster'], axis = 1)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(stratified_sampling)
    mds_euclidean = MDS(n_components=2, dissimilarity='euclidean')
    mds_data = mds_euclidean.fit_transform(data_scaled)  # do the math
    mds_euclidean_data = np.append(mds_data, cluster.values.reshape(64,1), axis=1)
    scatter_plot = pd.DataFrame(columns = ['x', 'y','cluster'], data = mds_euclidean_data)
    scatter_plot = scatter_plot.to_dict(orient='records')
    scatter_plot = {'data': scatter_plot}
    return jsonify(scatter_plot)

@app.route("/ScatterPlotMDSCorrTotal")
def ScatterPlotMDSCorrTotal():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(df)
    mds_data = metrics.pairwise_distances(data_scaled, metric = 'correlation')
    mds_correlation = MDS(dissimilarity='precomputed', n_components=2)
    mds_data_correlation = mds_correlation.fit_transform(mds_data)
    mds_data_correlation = pd.DataFrame( columns=['x', 'y'], data = mds_data_correlation)
    mds_data_correlation = mds_data_correlation.to_dict(orient='records')
    mds_data_correlation = {'data': mds_data_correlation}
    return jsonify(mds_data_correlation)

@app.route("/ScatterPlotMDSCorr")
def ScatterPlotMDSCorr():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    df = df.drop(['TEAM'], axis=1)
    random_sampling = df.sample(frac = 0.25)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(random_sampling)
    mds_data = metrics.pairwise_distances(data_scaled, metric = 'correlation')
    mds_correlation = MDS(dissimilarity='precomputed', n_components=2)
    mds_data_correlation = mds_correlation.fit_transform(mds_data)
    mds_data_correlation = pd.DataFrame( columns=['x', 'y'], data = mds_data_correlation)
    mds_data_correlation = mds_data_correlation.to_dict(orient='records')
    mds_data_correlation = {'data': mds_data_correlation}
    return jsonify(mds_data_correlation)

@app.route("/ScatterPlotMDSCorrStratified")
def ScatterPlotMDSCorrStratified():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    kmeans = KMeans(n_clusters = 4)
    df = df.drop(['TEAM'], axis = 1)
    kmeans = kmeans.fit(df)
    df["cluster"] = kmeans.labels_
    stratified_sampling = []
    cluster_data_3 = df[df['cluster']==3]
    cluster_data_3 = cluster_data_3.sample(16)
    cluster_data_2 = df[df['cluster']==2]
    cluster_data_2 = cluster_data_2.sample(16)
    cluster_data_1 = df[df['cluster']==1]
    cluster_data_1 = cluster_data_1.sample(16)
    cluster_data_0 = df[df['cluster']==0]
    cluster_data_0 = cluster_data_0.sample(16)

    temp = pd.DataFrame(stratified_sampling, columns=['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed',
           'Turnover allowed', 'Turn Over Commited', 'Free Throw Shot','Free Throw Allowed', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'])
    stratified_sampling = temp.append(cluster_data_0)
    stratified_sampling = stratified_sampling.append(cluster_data_3)
    stratified_sampling = stratified_sampling.append(cluster_data_2)
    stratified_sampling = stratified_sampling.append(cluster_data_1)
    cluster = stratified_sampling["cluster"]
    stratified_sampling = stratified_sampling.drop(['cluster'], axis = 1)
    scalar = StandardScaler()
    data_scaled = scalar.fit_transform(stratified_sampling)
    mds_data = metrics.pairwise_distances(data_scaled, metric='correlation')
    mds_correlation = MDS( dissimilarity='precomputed', n_components = 2)
    mds_data_correlation = mds_correlation.fit_transform(mds_data) 
    mds_data_correlation = np.append(mds_data_correlation, cluster.values.reshape(64,1), axis=1)
    scatter_plot = pd.DataFrame(columns=['x', 'y','cluster'], data = mds_data_correlation)
    scatter_plot = scatter_plot.to_dict(orient='records')
    scatter_plot = {'data': scatter_plot}
    return jsonify(scatter_plot)

@app.route("/ScatterPlotMatrixTotal")
def ScatterPlotMatrixTotal():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    kmeans = KMeans(n_clusters = 4)
    df = df.drop(['TEAM'], axis = 1)
    kmeans = kmeans.fit(df)
    df["cluster"] = kmeans.labels_
    stratified_sampling = []
    cluster_data_3 = df[df['cluster']==3]
    cluster_data_2 = df[df['cluster']==2]
    cluster_data_1 = df[df['cluster']==1]
    cluster_data_0 = df[df['cluster']==0]

    temp = pd.DataFrame(stratified_sampling, columns=['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed',
           'Turnover allowed', 'Turn Over Commited', 'Free Throw Shot','Free Throw Allowed', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'])
    stratified_sampling = temp.append(cluster_data_0)
    stratified_sampling = stratified_sampling.append(cluster_data_3)
    stratified_sampling = stratified_sampling.append(cluster_data_2)
    stratified_sampling = stratified_sampling.append(cluster_data_1)
    stratified_sampling = stratified_sampling.drop(['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed', 'Free Throw Shot', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'], axis=1)

    stratified_sampling_matrix = stratified_sampling.to_dict(orient= 'records')
    stratified_sampling_matrix = {'data': stratified_sampling_matrix}
    return jsonify(stratified_sampling_matrix)

@app.route("/ScatterPlotMatrixRandom")
def ScatterPlotMatrixRandom():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    kmeans = KMeans(n_clusters = 4)
    df = df.drop(['TEAM'], axis = 1)
    df = df.sample(frac = 0.25)
    kmeans = kmeans.fit(df)
    df["cluster"] = kmeans.labels_
    stratified_sampling = []
    cluster_data_3 = df[df['cluster']==3]
    cluster_data_2 = df[df['cluster']==2]
    cluster_data_1 = df[df['cluster']==1]
    cluster_data_0 = df[df['cluster']==0]

    temp = pd.DataFrame(stratified_sampling, columns=['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed',
           'Turnover allowed', 'Turn Over Commited', 'Free Throw Shot','Free Throw Allowed', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'])
    stratified_sampling = temp.append(cluster_data_0)
    stratified_sampling = stratified_sampling.append(cluster_data_3)
    stratified_sampling = stratified_sampling.append(cluster_data_2)
    stratified_sampling = stratified_sampling.append(cluster_data_1)
    stratified_sampling = stratified_sampling.drop(['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed', 'Free Throw Shot', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'], axis=1)

    stratified_sampling_matrix = stratified_sampling.to_dict(orient= 'records')
    stratified_sampling_matrix = {'data': stratified_sampling_matrix}
    return jsonify(stratified_sampling_matrix)

@app.route("/ScatterPlotMatrixStratified")
def ScatterPlotMatrixStratified():
    df = pd.read_csv("/Users/mkondeti/Documents/CSE564/lab2/basketball.csv")
    kmeans = KMeans(n_clusters = 4)
    df = df.drop(['TEAM'], axis = 1)
    kmeans = kmeans.fit(df)
    df["cluster"] = kmeans.labels_
    stratified_sampling = []
    cluster_data_3 = df[df['cluster']==3]
    cluster_data_3 = cluster_data_3.sample(16)
    cluster_data_2 = df[df['cluster']==2]
    cluster_data_2 = cluster_data_2.sample(16)
    cluster_data_1 = df[df['cluster']==1]
    cluster_data_1 = cluster_data_1.sample(16)
    cluster_data_0 = df[df['cluster']==0]
    cluster_data_0 = cluster_data_0.sample(16)

    temp = pd.DataFrame(stratified_sampling, columns=['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed',
           'Turnover allowed', 'Turn Over Commited', 'Free Throw Shot','Free Throw Allowed', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'])
    stratified_sampling = temp.append(cluster_data_0)
    stratified_sampling = stratified_sampling.append(cluster_data_3)
    stratified_sampling = stratified_sampling.append(cluster_data_2)
    stratified_sampling = stratified_sampling.append(cluster_data_1)
    stratified_sampling = stratified_sampling.drop(['Games Played', 'Won', 'Offensive Efficiency', 
            'Defensive Efficiency', 'Power Rating', 'Field Goal Shot', 'Field Goal Allowed', 'Free Throw Shot', 
            'Two Point Shot', 'Two Point Allowed', 'Three Point Shot', 'Three Point Allowed', 'cluster'], axis=1)

    stratified_sampling_matrix = stratified_sampling.to_dict(orient= 'records')
    stratified_sampling_matrix = {'data': stratified_sampling_matrix}
    return jsonify(stratified_sampling_matrix)

if __name__ == "__main__":
   app.run( debug = True)
