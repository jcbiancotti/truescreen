<template>
  <div class="home">
    
    <telon :hidden="hiddentelon"/>
    
    <!-- LISTA DE PANTALLAS -->
    <!-- <div class="card-deck"> -->

        <div class="row w-100 p-2 w-0">

            <div class="col-lg-4 mb-2" v-for="documento of aDocumentos" :key="documento.clave">

                <div class="card mx-auto" style="width:18rem;">

                    <div class="card-header text-left" style="line-height:12px;background-color: var(--true-color-empresa);">
                        <p style="color:silver">Pantalla id: {{documento.id}}</p>
                    </div>
                    <div class="card-body text-justify" style="line-height : 12px;">

                        <p>Título: {{documento.titulo}}</p>
                        <p>Version: {{documento.version}}</p>
                        <p>tipo: {{documento.tipo_lit}}</p>
                        <p>
                            <label class="content-input">
                                <input type="checkbox" v-model="documento.isActiva" :disabled="true">
                                <i></i>
                            </label>
                        </p>

                    </div>
                    
                    <div class="card-footer text-end">
                        <span @click="Editar(documento.id)" class="iconos inline-icon btn-img material-icons" title="Editar este documento">edit</span>
                        <span @click="Clonar(documento.id)" class="iconos inline-icon btn-img material-icons" title="Duplicar este documento">content_copy</span>
                        <span @click="Borrar(documento.id)" class="iconos inline-icon btn-img material-icons" title="Borrar este documento">delete</span>
                    </div>

                </div>

            </div>

        </div>

    <!-- </div> -->

  </div>
</template>

<script>

import funciones from '@/utils/funciones'
import datos from '@/utils/datos'
import telon from '@/components/visuales/telon'

export default {
    name: 'Home',
    data(){
        return {
            hiddentelon: true,
            aDocumentos: [],
            dTipos: [
                {id: '0', literal: "Selecciona ..."},
                {id: 'G', literal: "Tabla de gestiones"},
                {id: 'C', literal: "CRUD (create, read, update, delete)"},
                {id: 'D', literal: "Informar datos"},
                {id: 'I', literal: "Listado o Informe"},
                {id: 'B', literal: "Buscador"},
                {id: 'S', literal: "Selector"},
            ],            
            // Modelo de la pantalla            
            modelo: {
                oDatosGenerales: {
                    screenId: funciones.generarUUID2(), 
                    titulo: '',
                    version: 0,
                    activa: false,                    
                },
                oDisenio: {
                    titulo: '',
                    subtitulo: '',
                    tipo: '0'
                },
                oTablaGestiones: {
                    idQuery: '0',
                    Columnas: [],
                    Row_editar: false,
                    Row_eliminar: false,
                    
                }
            }

        }
    },
    components:{
        telon,

    },
    methods: {
        leerScreens() {

            try {

                this.aDocumentos = [];

                this.hiddentelon = false;

                datos.leerLista("sys_screens", "true", ["clave","id", "titulo","tipo","version","activa"], "")
                .then((result) => {

                    if(global.DEBUG)
                        console.log("leerScreens", "datos devueltos datos.leerLista", result);


                    if(result.success == 1) {

                        if(result.status == 200) {

                            for(let x = 0; x < result.data.length; x++) {

                                let act = false;
                                if(result.data[x].activa == 1) {
                                    act = true;
                                }

                                let xtipo = this.dTipos[this.dTipos.findIndex(t => t.id === result.data[x].tipo)].literal;
                                
                                this.aDocumentos.push({
                                    clave: result.data[x].clave,
                                    id: result.data[x].id,
                                    titulo: result.data[x].titulo,
                                    tipo_lit: xtipo,
                                    version:result.data[x].version,
                                    activa:result.data[x].activa,
                                    isActiva: act
                                });
                                
                            }

                        } 

                    }

                }).finally(() => {
                    this.hiddentelon = true;
                });

            } catch(error) {
                console.log(error)
            }


        },
        Editar(pId) {
            this.$router.push("/editscreen/" + pId)
        },        
        Borrar(pId) {

            funciones.popAlert('warning', 'Quieres borrar la definición de esta pantalla?', true, true, 8000, "Sí, bórrala!")
            .then((result) => {

                if(result==true) {

                    try {

                        this.hiddentelon = false;

                        datos.borrarScreen("id='" + pId + "'")
                        .then((result) => {

                            if(result.success == 1 && result.status == 200) {
                                funciones.popAlert('success', 'Definición eliminada!', false, false, 3000, "Ok")
                                .then(() => {
                                    this.leerScreens();
                                })

                            } else {
                                funciones.popAlert('error', 'No se ha podido eliminar la definición en este momento', true, false, 8000, "Ok")
                            }

                        }).finally(() => {
                            this.hiddentelon = true;
                        });
                        
                    } catch (error) {
                        console.log(error);
                    }
                    
                }

            })

        },
        Clonar(pId) {

            funciones.popAlert('question', 'Quieres hacer una copia de la definición de esta pantalla?', true, true, 8000, "Sí, cópiala")
            .then((result) => {

                if(result==true) {

                    this.hiddentelon = false;   

                    try {

                        datos.leerLista('sys_screens', "id='" + pId + "'", ['objeto'], '')
                        .then((result) => {

                            if(result.success == 1 && result.status == 200) {

                                this.modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                                let tmp = this.modelo;
                            
                                tmp.oDatosGenerales.screenId = funciones.generarUUID2();
                                tmp.oDatosGenerales.titulo = "Copia de " + this.modelo.oDatosGenerales.titulo;
                                tmp.oDatosGenerales.version = 0;
                                tmp.oDatosGenerales.activa = false;
 
                                // Almacenar propiedades del documento
                                let almacenar = {
                                    id:      tmp.oDatosGenerales.screenId, 
                                    titulo:  tmp.oDatosGenerales.titulo, 
                                    version: tmp.oDatosGenerales.version,
                                    tipo:    tmp.oDisenio.tipo,
                                    activa:  tmp.oDatosGenerales.activa, 
                                    objeto:  JSON.stringify(this.modelo, null, '\t')
                                };
                                datos.grabarScreen(almacenar)
                                .then((result) => {

                                    if(result.success == 1 && result.status == 201) {

                                        funciones.popAlert("success", "Nueva definición creada!", false, false, 3000, "ok")
                                        .then(() => {
                                            this.leerScreens();
                                        });

                                    } else {
                                        funciones.popAlert("error", "No se ha podido grabar!", false, false, 3000, "ok")
                                    }

                                })


                            }

                        }).finally(() => {
                            this.hiddentelon = true;
                        });

                    } catch(error) {
                        console.log(error);
                    }

                }

            })

        },

    },
    mounted() {
        this.leerScreens();

    }
}
</script>
