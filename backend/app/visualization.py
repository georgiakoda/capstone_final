import pandas as pd
import plotly.express as px

def plot_emotion_counts(emotion_data):
    df = pd.DataFrame({
        "emotion": list(emotion_data.keys()),
        "count": list(emotion_data.values())
    })

    fig = px.bar(df, x="emotion", y="count", text_auto=True)
    fig.show()
