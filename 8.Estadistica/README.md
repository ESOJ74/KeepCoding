# Estadistica 

Esta asignatura la veremos con R y notebooks jupyter. Todo el entorno está montado en un docker publicado en docker-hub:
https://hub.docker.com/r/calabozo/estadistica

Para arrancar en docker simplemente teneis que ejecutar desde el directorio del curso, es decir donde habeis descargado el codigo de gitlab.
Recordad que el código se descarga con:
`$ git clone https://gitkc.cloud/keepcoding-bootcamps/full-stack-big-data-ai-y-ml-viii/estad-stica/curso_estadistica.git`

después teneis que entrar en el directorio donde estará el temario del curso: `cd curso_estadistica`.

Una vez ahí podeis lanzar docker.

Si estais en Linux:
  `$ docker run -it -p 8888:8888 --user $(id -u) -v ${PWD}:/mnt calabozo/estadistica`

Si estais en Mac o Windows con Powershell: 

  `$  docker run --rm -it -p 8888:8888 -v ${PWD}:/mnt calabozo/estadistica `

Si estais en Windows y lo anterior no os funciona probad: 

  `$  docker run --rm -it -p 8888:8888 -v /c/miruta_del_curso:/mnt calabozo/estadistica `

   Suponiendo que teneis el curso en C:\miruta_del_curso. La ruta tiene que estar en minúsucla y no ha de tener espacios. Si en lugar de usar la unidad C: usais otra debeis reemplazar el /c por la unidad correpondiente.

   Los usuarios de Windows además tendrán que dar permisos de compartición a la unidad de disco desde la cual van a ejecutarlo, en el menú "Settings > Shared Drives" 
Si en windows teneis problemas con la virtualización os teneis que asegurar que Hiper-V está activado, con el comando "systeminfo" podeis averiguarlo.
Para activar Hipyer-V es posible que tengais que ejecutar: "bcdedit /set hypervisorlaunchtype auto"

Al lanzar el docker anterior vereis algo como:
```
[I 07:41:59.391 NotebookApp] Writing notebook server cookie secret to /home/docker/.local/share/jupyter/runtime/notebook_cookie_secret
[W 07:41:59.670 NotebookApp] All authentication is disabled.  Anyone who can connect to this server will be able to run code.
[I 07:41:59.682 NotebookApp] Serving notebooks from local directory: /mnt
[I 07:41:59.683 NotebookApp] The Jupyter Notebook is running at:
[I 07:41:59.683 NotebookApp] http://(89688eea8b56 or 127.0.0.1):8888/
[I 07:41:59.683 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[W 07:41:59.688 NotebookApp] No web browser found: could not locate runnable browser.

```


Comprobad que todo funciona intentando entrar en vuestro navegador en http://localhost:8888/



Si carga juypter notebook significa que todo ha ido bien.

## Si el Docker falla:


### Instalar R y jupyter en tu máquina con Anaconda

Se puede instalar el entorno de R y jupyter notebook con el entorno Conda. Instrucciones aquí:
 https://docs.anaconda.com/anaconda/navigator/tutorials/r-lang/

Una vez instalado R debeis instalar los siguientes paquetes de R. Para ello podeis abrir una consola de R y ejecutar las siguientes instrucciones.

install.packages(c('repr','IRdisplay', 'evaluate', 'crayon', 'pbdZMQ', 'devtools', 'uuid', 'digest','ggplot2','reshape2','entropy','quantmod','caret','curl','dplyr','dslabs','e1071','egg','GGally','ggpubr','jpeg','MASS','microbenchmark','glmnet','plotrix','plyr','pracma','reshape2','ROCR','tm','zoo','glmnetUtils','tidyverse','dendextend','gplots','dbscan','neuralnet','ggdendro','car','reticulate','Rsolnp','FactoMineR'),repos='https://cran.rstudio.com/')"
install.packages(c('jtools','broom','ggstance','factoextra'))


