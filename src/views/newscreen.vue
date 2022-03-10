<template>
<div class="container-fluid">

    <telon :hidden="hiddentelon"/>

    <h1 v-if="claveId != null">Editando pantalla: {{claveId}}</h1>

    <!-- TABS -->
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 1}" @click="tab=1" data-toggle="tab" href="#datos-screen">Datos generales</a></li>

        <li class="nav-item"><a class="nav-link" :class="{active : tab == 9}" @click="Grabar()">Grabar</a></li>
    </ul>

    <!-- Tab panes -->
    <div class="tab-content">

        <!-- METADATOS -->
        <div id="datos-screen" class="container-fluid tab-pane fade " :class="{show : tab == 1, active : tab == 1}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Datos generales</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div class="form-group row" style="color: silver;">{{modelo.oDatosGenerales.screenId}}</div>

                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>(*) T&iacute;tulo:</label>
                            </div>
                            <div class="w-50 text-left">
                                <input type="text" class="form-control" v-model="modelo.oDatosGenerales.titulo" placeholder="Nombre para identificar el documento" :class="{conerror : hayerror == 3, sinerror : hayerror == 0}">
                            </div>
                        </div> 

                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>(*) Versi&oacute;n:</label>
                            </div>
                            <div class="w-50 text-left">
                                <input type="text" class="form-control" v-model="modelo.oDatosGenerales.version" placeholder="Versión del documento" :class="{conerror : hayerror == 3, sinerror : hayerror == 0}">
                            </div>
                        </div>

                        <div class="input-group p-2">
                            <div class="w-50 text-right">
                                <label>Versión activada:</label>
                            </div>
                            <div class="w-50 text-left">
                                <label class="content-input">
                                    <input type="checkbox" v-model="modelo.oDatosGenerales.activa">
                                    <i></i>
                                </label>    
                                <span>(Se utilizará la versión activada de mayor valor)</span>
                            </div>
                        </div>

                    </form>

                </div>

            </div>
            </div>

        </div>





    </div> 

</div>
</template>

<script>

import funciones from '@/utils/funciones'
import telon from '@/components/visuales/telon'

export default {
    name: 'NewScreen',
    data() {
        return {
            tab: 1,
            hiddentelon: true,
            claveId: '',
            modelo: {
                oDatosGenerales: {
                    screenId: funciones.generarUUID2(), 
                    titulo: '',
                    version: 0,
                    activa: false,                    
                }
            }

            
        }
    },
    components:{
        telon,
    },
    methods: {
        cero(e) {
            e.preventDefault();
        },        
        LeerDatos() {


        },
        Grabar() {


        }


        
    },
    mounted(){
        this.claveId = this.$route.params['p_claveId'];
        if(this.claveId != null) {
            this.LeerDatos();
        }
    },
}

</script>

<style>

</style>
