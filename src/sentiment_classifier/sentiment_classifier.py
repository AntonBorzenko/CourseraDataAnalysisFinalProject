from sklearn.externals import joblib
import numpy as np
from os import path


default_model_file = path.join( path.dirname(path.abspath(__file__)), 'model_ru_udpipe.joblib.zip' )


class SentimentClassifier:
    def __init__(self, joblib_file=default_model_file):
        self.model = joblib.load(joblib_file)
        
    def predict_text(self, text):
        probs = self.model.predict_proba([text])[0]
        
        label = int(np.argmax(probs))
        prob = np.max(probs)
        
        return label, prob