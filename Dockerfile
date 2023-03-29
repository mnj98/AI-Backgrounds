# syntax=docker/dockerfile:experimental

FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04

RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install python3.10 python3-pip -y

COPY AI.py AI.py
COPY ai_reqs.txt reqs.txt

RUN python3.10 -m pip install -U -r reqs.txt

#RUN nvidia-smi

CMD python3.10 AI.py
