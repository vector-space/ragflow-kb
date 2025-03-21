export HF_ENDPOINT=https://hf-mirror.com
source .venv/bin/activate
export PYTHONPATH=$(pwd)
bash docker/launch_backend_service.sh