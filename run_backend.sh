#conda activate ragflow
export FLASK_APP=api/apps
export HF_ENDPOINT=https://hf-mirror.com
source .venv/bin/activate
export PYTHONPATH=$(pwd)
bash docker/launch_backend_service.sh
# flask run --host=0.0.0.0 --port=9380