# Para construir la imagen:
# docker build -t estadistica .
# Para ejecutar el docker:
# docker run -it -p 8888:8888 -v "$PWD":/mnt estadistica 

#FROM resin/raspberrypi3-debian:latest
FROM r-base:4.1.1 

# ensure local python is preferred over distribution python
ENV PATH /usr/local/bin:$PATH

# http://bugs.python.org/issue19846
# > At the moment, setting "LANG=C" on a Linux system *fundamentally breaks Python 3*, and that's not OK.
ENV LANG C.UTF-8

#RUN echo "deb http://mirrordirector.raspbian.org/raspbian/ buster main" > /etc/apt/sources.list


# runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        curl \
#        r-base r-base-core r-base-dev \
        libssl-dev \
        libcurl4-openssl-dev \
        libxml2-dev \
        libgit2-dev \
        libopenblas-dev \
        && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install jupyter
RUN R -e "install.packages('IRkernel')"
RUN R -e "IRkernel::installspec(user = FALSE)"

RUN R -e "install.packages(c('repr','IRdisplay', 'evaluate', 'crayon', 'pbdZMQ', 'devtools', 'uuid', 'digest','ggplot2','reshape2','entropy','quantmod','caret','curl','dplyr','dslabs','e1071','egg','GGally','ggpubr','jpeg','MASS','microbenchmark','glmnet','plotrix','plyr','pracma','reshape2','ROCR','tm','zoo','glmnetUtils','tidyverse','dendextend','gplots','dbscan','neuralnet','ggdendro','car','reticulate','Rsolnp','FactoMineR'),repos='https://cran.rstudio.com/')"
RUN R -e "install.packages(c('jtools','broom','ggstance','factoextra'))"


CMD /usr/local/bin/jupyter notebook --allow-root --notebook-dir=/mnt --ip=0.0.0.0 --NotebookApp.token=
