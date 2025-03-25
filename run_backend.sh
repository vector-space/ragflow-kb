#conda activate ragflow
export HF_ENDPOINT=https://hf-mirror.com
source .venv/bin/activate
export PYTHONPATH=$(pwd)
# bash docker/launch_backend_service.sh
export FLASK_APP=api/apps
flask run --host=0.0.0.0 --port=9380