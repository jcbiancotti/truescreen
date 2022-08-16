<template>
<div class="container-fluid">

    <telon :hidden="hiddentelon"/>

    <h1 v-if="claveId != null">Definición de la pantalla: {{modelo.oDatosGenerales.titulo}} ({{claveId}})</h1>

    <!-- ICONO HAY ERRORES -->
    <div v-if="errores.length > 0" @click="E_expanded = !E_expanded" class="float-end p-2">

        <span v-if="error_grave > 0">Hay {{error_grave}} errores</span>
        <span v-if="error_grave == 0 && error_warning > 0">Hay {{error_warning}} alertas</span>

        <span v-if="E_expanded == false && error_grave > 0" class="iconos inline-icon btn-img material-icons float-end" style="color:red;" title="Errores bloqueante">error</span>
        <span v-if="E_expanded == false && error_grave == 0 && error_warning > 0" class="iconos inline-icon btn-img material-icons float-end" style="color:yellow;" title="Advertencias">warning</span>

        <span v-if="E_expanded == true && error_grave > 0" class="iconos inline-icon btn-img material-icons float-end" style="color:red;">close</span>
        <span v-if="E_expanded == true && error_grave == 0 && error_warning > 0"  class="iconos inline-icon btn-img material-icons float-end" style="color:yellow;">close</span>

    </div>
 
    <!-- TABS -->
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 1}" @click="tab=1" data-bs-toggle="tab" href="#datos-screen">Datos generales</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 2}" @click="tab=2" data-bs-toggle="tab" href="#datos-disenio">Dise&ntilde;o</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 3 && modelo.oDisenio.tipo == 'G', disabled : modelo.oDisenio.tipo != 'G'}" @click="tab=3" data-bs-toggle="tab" href="#datos-gestiones">Tabla de gestiones</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 4 && modelo.oDisenio.tipo == 'C', disabled : modelo.oDisenio.tipo != 'C'}" @click="tab=4" data-bs-toggle="tab" href="#datos-crud">CRUD</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 5 && modelo.oDisenio.tipo == 'D', disabled : modelo.oDisenio.tipo != 'D'}" @click="tab=5" data-bs-toggle="tab" href="#datos-cdatos">Informar datos</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 6 && modelo.oDisenio.tipo == 'I', disabled : modelo.oDisenio.tipo != 'I'}" @click="tab=6" data-bs-toggle="tab" href="#datos-listado">Listado / Informe</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 7 && modelo.oDisenio.tipo == 'B', disabled : modelo.oDisenio.tipo != 'B'}" @click="tab=7" data-bs-toggle="tab" href="#datos-buscar">Buscador</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 8 && modelo.oDisenio.tipo == 'S', disabled : modelo.oDisenio.tipo != 'S'}" @click="tab=8" data-bs-toggle="tab" href="#datos-selector">Selector</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 9}" @click="tab=10" data-bs-toggle="tab" href="#datos-JSON">JSON</a></li>

        <li class="nav-item"><a class="nav-link" :class="{active : tab == 10}" @click="Grabar()">Grabar</a></li>
    </ul>


    <!-- LISTA DE ERRORES -->
    <div v-if="E_expanded == true" style="border: 1px solid red;margin: 5px;border-radius: 5px !important;">

        <div class="float-end container-fluid">
            <span @click="Validaciones()" class="iconos inline-icon btn-img material-icons float-end" style="color:blue;" title="Comprobar errores">refresh</span>
        </div>

        <div v-for="err of errores" :key="err.idx">

            <div @click="enfocar(err.ref, err.tab)" class="input-group text-start" style="bacground-color: grey;cursor: pointer;">
                <div class="text-center" style="width:5%;">
                    {{err.idx}}
                </div>                
                <div style="width:15%;">
                    <span v-if="errDescripcion(err.codigo, 'C') == 1" class="iconos inline-icon btn-img material-icons" style="color:red;" title="Error bloqueante">error</span>
                    <span v-if="errDescripcion(err.codigo, 'C') == 2" class="iconos inline-icon btn-img material-icons" style="color:yellow;" title="Advertencia">warning</span>
                </div>
                <div style="width:20%;;">
                    {{err.codigo}} - {{errDescripcion(err.codigo, 'L')}}
                </div>
                <div style="width:60%;">
                    {{err.descripcion}}
                </div>
            </div>

        </div>

    </div>

    <!-- Tab panes -->
    <div class="tab-content">

        <!-- DATOS GENERALES -->
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
                            <div class="w-50 text-end">
                                <label>(*) T&iacute;tulo:</label>
                            </div>
                            <div class="w-50 text-start">
                                <input ref="scrTitulo" type="text" class="form-control" v-model="modelo.oDatosGenerales.titulo" placeholder="Nombre para identificar la definición">
                            </div>
                        </div> 

                        <div class="input-group">
                            <div class="w-50 text-end">
                                <label>(*) Versi&oacute;n:</label>
                            </div>
                            <div class="w-50 text-start">
                                <input ref="scrVersion" type="text" class="form-control" v-model="modelo.oDatosGenerales.version" placeholder="Versión del documento">
                            </div>
                        </div>

                        <div class="input-group p-2">
                            <div class="w-50 text-end">
                                <label>Versión activada:</label>
                            </div>
                            <div class="w-50 text-start">
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

        <!-- DISEÑO -->
        <div id="datos-screen" class="container-fluid tab-pane fade " :class="{show : tab == 2, active : tab == 2}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Dise&ntilde;o</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <!-- TITULO -->
                        <div class="input-group">
                            <div class="w-50 text-end">
                                <label>(*) T&iacute;tulo:</label>
                            </div>
                            <div class="w-50">                            
                                <input ref="scrDisenioTitulo" type="text" class="form-control" v-model="modelo.oDisenio.titulo" placeholder="Título principal de la pantalla">
                            </div> 
                        </div>

                        <!-- SUBTITULO -->
                        <div class="input-group">
                            <div class="w-50 text-end">
                                <label>Sub-t&iacute;tulo:</label>
                            </div>
                            <div class="w-50">                            
                                <input ref="scrSubtitulo" type="text" class="form-control" v-model="modelo.oDisenio.subtitulo" placeholder="Subtítulo de la pantalla">
                                <p>Es posible combinar variables con el texto, por ejemplo "Acciones a *!*fecha_hoy*!*". La lista de variables se describe en la documentación</p>
                            </div> 

                        </div>

                        <!-- TIPO -->
                        <div class="input-group">
                            <div class="w-50 text-end">
                                <label>(*) Tipo de pantalla:</label>
                            </div>
                            <div class="w-50">
                                <select ref="scrTipo" class="form-select" v-model="this.modelo.oDisenio.tipo">
                                    <option v-for="t of dTipos" :key="t.id" :value="t.id" :disabled="t.id=='0'">{{t.literal}}</option>
                                </select>                                
                            </div> 
                        </div>                      

                    </form>

                </div>

            </div>
            </div>

        </div>

        <!-- TABLA DE GESTIONES -->
        <div id="datos-screen" class="container-fluid tab-pane fade " :class="{show : tab == 3, active : tab == 3}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Tabla de gestiones</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <table>
                            <!-- QUERY -->
                            <tr class="text-start">
                                <td class="text-start">
                                    <label>(*) Consulta de datos:</label>
                                </td>
                                <td class="text-start">
                                    <select ref="tgQuery" class="form-select" v-model="modelo.oTablaGestiones.idQuery" @change="tgCambioQuery()"> 
                                        <option v-for="q of aQuerys" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.id}} {{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="text-start">
                                    <span v-if="modelo.oTablaGestiones.idQuery == '0'" class="iconos inline-icon btn-img material-icons" title="Selecciona una consulta">visibility_off</span>
                                    <span @click="CargaConsulta(modelo.oTablaGestiones.idQuery)" v-if="modelo.oTablaGestiones.idQuery != '0'" class="iconos inline-icon btn-img material-icons" title="Ver consulta">visibility</span>
                                </td>
                            </tr>
                            <tr v-if="modelo.oTablaGestiones.idQuery != '0' && tgCadenaSQL != ''">
                                <td colspan="3"> 
                                    <div  class="w-100 input-group addon pb-4">
                                        <div class="container-fluid">
                                            <span @click="tgCadenaSQL = ''" class="iconos inline-icon btn-img material-icons float-end" title="Cerrar">close</span>
                                        </div>
                                        <textarea ref="tgConsultaSQL" id="tgConsultaSQL" class="form-control" disabled rows="5" :maxlength="5000" style="height: 100px;width: 100%;font-family:Courier" v-model="tgCadenaSQL" placeholder="Consulta SQL completa"></textarea>
                                    </div>
                                </td> 
                            </tr>
                            <tr v-if="modelo.oTablaGestiones.idQuery != '0' && tgCadenaSQL != ''">
                                <td colspan="3">
                                    <!-- LISTA DE FILTROS -->
                                    <div class="btn-img text-start">
                                        <h4>Filtros</h4>
                                    </div> 
                                    <div class="tableFixHead table-responsive" style="height:auto;">
                                    <table >
                                        <thead>
                                            <th>Etiqueta</th>
                                            <th>Tipo</th>
                                            <th>Obligatorio</th>
                                            <th>Variable en la consulta</th>
                                            <!-- <th>Valor por defecto</th> -->
                                        </thead>
                                        <tr v-for="registro of aFiltros" :key="registro.id">
                                            <td>{{registro.etiqueta}}</td>
                                            <td>{{registro.tipo_lit}}</td>
                                            <td>
                                                <span v-if="registro.obligatorio == true">Si</span>
                                                <span v-if="registro.obligatorio == false">No</span>                                                
                                            </td>
                                            <td>{{registro.variable}}</td>
                                            <!-- <td>{{registro.valordefecto}}</td> -->
                                        </tr>

                                    </table>
                                    </div>     
                                </td>                           
                            </tr>                        
                        </table>
                        <!-- NUEVA COLUMNA -->
                        <div class="btn-img text-end" @click="tg_expanded = !tg_expanded">
                            <h3 class="float-end">Columnas</h3>
                            <span v-if="tg_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="tg_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="tg_expanded">     

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- TITULO -->
                                    <td class="w-30">
                                        <div class="text-start input-group addon">
                                            <label>(*) T&iacute;tulo para la columna:</label>
                                            <input ref="reftgTituloColumna" type="text" class="form-control" v-model="tgTituloColumna" placeholder="Título para la columna">
                                        </div> 
                                    </td>
                                    <!-- CAMPO -->
                                    <td class="w-60">
                                        <div class="text-start input-group addon">
                                            <label>(*) Campo:</label>
                                            <select ref="reftgCampoColumna" class="form-select" v-model="tgCampoColumna">
                                                <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.descripcion">{{q.descripcion}}</option>
                                            </select>        
                                        </div>                            
                                    </td>
                                    <!-- BOTONES -->
                                    <td class="w-10">
                                        <span @click="tgAgregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="tgDescartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <td colspan="2">
                                        <div class="input-group addon">
                                            <label for="reftgOrdenar">Ordenar por esta columna:</label>
                                            <label class="content-input">
                                                <input ref="reftgOrdenar" id="reftgOrdenar" type="checkbox" v-model="tgOrdenarColumna">
                                                <i></i>
                                            </label>                                              
                                        </div>
                                    </td> 
                                    <td class="text-end" style="color:red;">
                                        {{tgMensaje}}
                                    </td>
                                </tr>                                
                            </table>

                        </div>

                        <!-- LISTA DE COLUMNAS -->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table >
                            <thead>
                                <th>T&iacute;tulo</th>
                                <th>Campo</th>
                                <th>Ordenar</th>
                                <th></th>
                                <th></th>
                            </thead>
                            <tr v-for="registro of modelo.oTablaGestiones.Columnas" :key="registro.id">
                                <td>{{registro.titulo}}</td>
                                <td>{{registro.campo}}</td>
                                <td colspan="2">
                                    <span v-if="registro.ordenar == true">Si</span>
                                    <span v-if="registro.ordenar == false">No</span>
                                </td>
                                <td>
                                    <span @click="tgQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="tgEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>

                        <div class="btn-img float-end">
                            <h3 class="float-end">Otros datos</h3>
                            <span class="material-icons">radio_button_unchecked</span>
                        </div>
                        <div class="tableFixHead table-responsive">
                        <table>
                            <!-- PRIMER RENGLON -->
                            <tr>
                                <td>
                                    <div class="input-group addon">
                                        <label for="reftgAgregar">Agregar nuevos registros:</label>
                                        <label class="content-input">
                                            <input ref="reftgAgregar" id="reftgAgregar" type="checkbox" v-model="modelo.oTablaGestiones.Row_agregar">
                                            <i></i>
                                        </label>                                              
                                    </div>
                                </td> 
                                <td>
                                    <div class="input-group addon">
                                        <label for="reftgListar">Listar la tabla:</label>
                                        <label class="content-input">
                                            <input ref="reftgListar" id="reftgListar" type="checkbox" v-model="modelo.oTablaGestiones.Row_listar">
                                            <i></i>
                                        </label>                                              
                                    </div>
                                </td>                                                                
                                <td>
                                    <div class="input-group addon">
                                        <label for="reftgEditar">Editar el registro:</label>
                                        <label class="content-input">
                                            <input ref="reftgEditar" id="reftgEditar" type="checkbox" v-model="modelo.oTablaGestiones.Row_editar">
                                            <i></i>
                                        </label>                                              
                                    </div>
                                </td> 
                                <td>
                                    <div class="input-group addon">
                                        <label for="reftgEliminar">Eliminar el registro:</label>
                                        <label class="content-input">
                                            <input ref="reftgEliminar" id="reftgEliminar" type="checkbox" v-model="modelo.oTablaGestiones.Row_eliminar">
                                            <i></i>
                                        </label>                                              
                                    </div>
                                </td>                                     

                            </tr>    
                            <!-- SEGUNDO RENGLON-->
                            <tr>
                                <td>
                                    <div class="text-start input-group addon">
                                        <label>(*) Pantalla Agregar:</label>
                                        <select ref="reftgPantallaAdd" class="form-select" :disabled="!modelo.oTablaGestiones.Row_agregar" v-model="modelo.oTablaGestiones.PantallaAdd">
                                            <option v-for="q of aPantallasC" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                        </select>        
                                    </div>   
                                </td> 
                                <td>
                                    <div class="text-start input-group addon">
                                        <label>(*) Pantalla Listar:</label>
                                        <select ref="reftgPantallaList" class="form-select" :disabled="!modelo.oTablaGestiones.Row_listar" v-model="modelo.oTablaGestiones.PantallaList">
                                            <option v-for="q of aPantallasI" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                        </select>        
                                    </div>                                       
                                </td>                                                                
                                <td>
                                    <div class="text-start input-group addon">
                                        <label>(*) Pantalla Editar:</label>
                                        <select ref="reftgPantallaEdit" class="form-select" :disabled="!modelo.oTablaGestiones.Row_editar" v-model="modelo.oTablaGestiones.PantallaEdit">
                                            <option v-for="q of aPantallasC" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                        </select>        
                                    </div> 
                                </td> 
                                <td>

                                </td>                                     

                            </tr>                               
                        </table>   
                        </div>                     

                    </form>

                </div>

            </div>
            </div>

        </div>

        <!-- CRUD -->
        <div id="datos-crud" class="container-fluid tab-pane fade " :class="{show : tab == 4, active : tab == 4}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>CRUD 1 (Crear o Editar un registro)</h3>
                </div>

                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <!-- TABLA -->
                        <table>
                            <tr>
                                <td class="text-start" style="width:30%;">
                                    <label>(*) Tabla principal:</label>
                                </td>
                                <td class="text-start" style="width:60%;">
                                    <select ref="cr1Tabla" class="w-100 form-select" v-model="modelo.oCRUD01.tabla" @change="cargaCamposTabla(modelo.oCRUD01.tabla)"> 
                                        <option v-for="q of aTablas" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="text-start"  style="width:10%;">
                                </td>
                            </tr>

                        </table>

                        <div class="btn-img float-end" @click="cr1_expanded = !cr1_expanded">
                            <h3 class="float-end">Campos</h3>
                            <span v-if="cr1_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="cr1_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="cr1_expanded">     

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- CAMPO -->
                                    <td style="width:30%;">
                                        <div class="text-start input-group addon">
                                            <label>(*) Campo:</label>
                                            <select ref="refcr1Campo" class="form-select" v-model="cr1Campo" @change="cr1CambiaCampo()">
                                                <option v-for="q of cr1Campos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                            </select>        
                                        </div>                            
                                    </td>   
                                    <!-- ETIQUETA -->
                                    <td style="width:40%;">
                                        <div class="text-start input-group addon">
                                            <label>(*) Etiqueta en pantalla:</label>
                                            <input ref="refcr1Etiqueta" type="text" class="form-control" v-model="cr1Etiqueta" placeholder="Etiqueta en pantalla">
                                        </div> 
                                    </td> 
                                    <!-- ENABLED INICIAL -->
                                    <td style="width:20%;">
                                        <div class="input-group addon">
                                            <label for="refcr1EnabledInicial">Habilitado al inicio:</label>
                                            <label class="content-input">
                                                <input ref="refcr1EnabledInicial" id="refcr1EnabledInicial" type="checkbox" v-model="cr1EnabledInicial">
                                                <i></i>
                                            </label>                                              
                                        </div>
                                    </td>                                     
                                    <!-- BOTONES -->
                                    <td style="width:10%;">
                                        <span @click="cr1Agregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="cr1Descartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <!-- FORMATO -->
                                    <td>
                                        <div class="text-start input-group addon">
                                            <label>(*) Formato:</label>
                                            <select ref="refcr1Formato" class="form-select" v-model="cr1Formato" @change="cr1ValorDefault = ''">
                                                <option v-for="q of cTipos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.literal}}</option>
                                            </select>        
                                        </div> 
                                    </td>  
                                    <!-- VALOR POR DEFECTO SEGUN EL TIPO -->
                                    <td colspan="2">
                                        <div v-if="cr1Formato=='C'" class="input-group addon">
                                            <label for="nuevo_cr1Default">Valor inicial:</label>
                                            <input ref="nuevo_cr1Default" id="nuevo_cr1Default" type="text" class="form-control" :maxlength="tancho" style="width:60%;" v-model="cr1ValorDefault" placeholder="Valor inicial">
                                        </div>

                                        <div v-if="cr1Formato=='D'" class="input-group addon">
                                            <label for="nuevo_cr1Default">Valor inicial:</label>
                                            <input ref="nuevo_cr1Default" id="nuevo_cr1Default" type="date" class="form-control" :maxlength="tancho" style="width:60%;" v-model="cr1ValorDefault" placeholder="Valor inicial">
                                        </div> 
                                        <div v-if="cr1Formato=='T'" class="input-group addon">
                                            <label for="nuevo_cr1Default">Valor inicial:</label>
                                            <input ref="nuevo_cr1Default" id="nuevo_cr1Default" type="datetime-local" class="form-control" :maxlength="tancho" style="width:60%;" v-model="cr1ValorDefault" placeholder="Valor inicial">
                                        </div>    
                                        <div v-if="cr1Formato=='H'" class="input-group addon">
                                            <label for="nuevo_cr1Default">Valor inicial:</label>
                                            <input ref="nuevo_cr1Default" id="nuevo_cr1Default" type="time" class="form-control" :maxlength="tancho" style="width:60%;" v-model="cr1ValorDefault" placeholder="Valor inicial">
                                        </div>       
                                        <div v-if="cr1Formato=='A'" class="input-group addon mb-3">
                                            <label for="nuevo_cr1Default">Valor inicial:</label>
                                            <textarea ref="nuevo_cr1Default" id="nuevo_cr1Default" class="form-control" cols="50" :maxlength="tancho" style="width:100%;" v-model="cr1ValorDefault" placeholder="Valor inicial"></textarea>
                                        </div>
                                        <div v-if="cr1Formato=='K'">
                                            <div class="input-group addon">
                                                <label for="nuevo_cr1Default">Valor inicial:</label>
                                                <label class="content-input">
                                                    <input ref="nuevo_cr1Default" id="nuevo_cr1Default" type="checkbox" v-model="cr1ValorDefault">
                                                    <i></i>
                                                </label>                                              
                                            </div>
                                        </div>        
                                        <div v-if="cr1Formato=='N' || cr1Formato=='M'" class="input-group addon">
                                            <label for="nuevo_cr1Default">Valor inicial:</label>
                                            <input 
                                                ref="nuevo_cr1Default" 
                                                id="nuevo_cr1Default" 
                                                type="text" style="width:60%;" 
                                                class="form-control" 
                                                v-model="cr1ValorDefault" 
                                                @blur="cr1ValidarDefault($event)"
                                                @keydown="noPuntos($event, false)"
                                                :title="`${'Valor máximo permitido: ' + cr1ValorMaximoDefault}`"> 
                                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="z-index:9999" v-if="cr1DefError">Máx: {{cr1ValorMaximoDefault}}</span>
                                        </div>
                                        <!-- LISTA DE VALORES -->
                                        <div v-if="cr1Formato=='L'">
                                            <div class="text-start input-group addon">
                                                <div style="width:20%;">
                                                    <label>(*) Lista de valores:</label>
                                                </div>
                                                <div style="width:80%;">
                                                    <select ref="refcr1Listaval" class="form-select w-90" v-model="cr1Listaval" @change="cr1CambiaListaVal()">
                                                        <option v-for="q of aListasVal" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="text-start input-group addon"> 
                                                <div style="width:20%;">       
                                                    <label>(*) Valor por defecto:</label>
                                                </div>
                                                <div style="width:80%;">
                                                    <select ref="refcr1ListavalDef" class="form-select w-90" v-model="cr1ValorDefault">
                                                        <option v-for="q of cr1ListaValValores" :key="q.id" :value="q.valor">{{q.descripcion}}</option>
                                                    </select>   
                                                </div>     
                                            </div>                                                         
                                        </div>                                                                                                       
                                        <!-- SELECTABLE -->
                                        <div v-if="cr1Formato=='S'">
                                            <div class="text-start input-group addon">
                                                <div style="width:20%;">
                                                    <label>(*) Seleccionable:</label>
                                                </div>
                                                <div style="width:80%;">
                                                    <select ref="refcr1Listaval" class="form-select w-90" v-model="cr1Selectable">
                                                        <option v-for="q of aSelectables" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div> 
                                    </td>
                                    <!-- MENSAJE -->
                                    <td class="text-end" style="color:red;">
                                        {{cr1Mensaje}}
                                    </td>
                                </tr>

                            </table>

                        </div>

                        <!-- LISTA DE CAMPOS CRUD01 -->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table >
                            <thead>
                                <th>Campo</th>
                                <th>Etiqueta</th>
                                <th>Formato</th>
                                <th>Valor por defecto</th>
                                <th>Habilitado al inicio</th>
                                <th></th>
                            </thead>
                            <tr v-for="registro of modelo.oCRUD01.Campos" :key="registro.id">
                                <td>{{registro.campo}}</td>
                                <td>{{registro.etiqueta}}</td>
                                <td>{{cTipos[cTipos.findIndex( x => x.id == registro.formato)].literal}}</td>
                                <td>
                                    <span v-if="registro.formato == 'K' && registro.valordefault == true">Si</span>
                                    <span v-if="registro.formato == 'K' && registro.valordefault == false">No</span>
                                    <span v-if="registro.formato != 'K'">{{registro.valordefault}}</span>
                                </td>
                                <td>
                                    <span v-if="registro.enabledinicial == true">Si</span>
                                    <span v-if="registro.enabledinicial == false">No</span>
                                </td>
                                <td>
                                    <span @click="cr1Quitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="cr1Editar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>

                    </form>

                </div>

            </div>
            </div>

        </div>

        <!-- CAPTURA DE DATOS -->
        <div id="datos-cdatos" class="container-fluid tab-pane fade " :class="{show : tab == 5, active : tab == 5}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Capturar/Informar datos</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div ref="cdCampos" class="btn-img float-end" @click="cd_expanded = !cd_expanded">
                            <h3 class="float-end">Campos</h3>
                            <span v-if="cd_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="cd_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>
                        <div v-if="cd_expanded">
                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- ETIQUETA -->
                                    <td style="width:40%;">
                                        <div class="text-start input-group addon">
                                            <label>(*) Etiqueta en pantalla:</label>
                                            <input ref="refcdEtiqueta" type="text" class="form-control" v-model="cdEtiqueta" placeholder="Etiqueta en pantalla">
                                        </div> 
                                    </td> 
                                    <!-- FORMATO -->
                                    <td>
                                        <div class="text-start input-group addon">
                                            <label>(*) Formato:</label>
                                            <select ref="refcdFormato" class="form-select" v-model="cdFormato" @change="cdCambiaFormato()">
                                                <option v-for="q of cTipos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.literal}}</option>
                                            </select>        
                                        </div> 
                                    </td>                                      
                                    <!-- ENABLED INICIAL -->
                                    <td style="width:20%;">
                                        <div class="input-group addon">
                                            <label for="refcdListar">Habilitado al inicio:</label>
                                            <label class="content-input">
                                                <input ref="refcdEnabledInicial" id="refcrListar" type="checkbox" v-model="cdEnabledInicial">
                                                <i></i>
                                            </label>                                              
                                        </div>
                                    </td>                                     
                                    <!-- BOTONES -->
                                    <td style="width:10%;">
                                        <span @click="cdAgregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="cdDescartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <!-- ANCHO -->
                                    <td>
                                        <div class="text-start input-group addon">
                                            <label>(*) Ancho:</label>
                                            <input ref="refcdAncho" type="text" class="form-control" v-model="cdAncho" placeholder="Longitud permitida" @change="cdCambiaAncho()" @keydown="noPuntos($event, true)">
                                        </div> 
                                    </td>  
                                    <!-- DECIMALES -->
                                    <td v-if="cdFormato=='N' || cdFormato=='M'">
                                        <div class="text-start input-group addon">
                                            <label>(*) Decimales:</label>
                                            <select ref="refcdFormato" class="form-select" v-model="cdDecimales" @change="cdValorDefault = ''">
                                                <option v-for="(q, i) in 7" :key="q" :value="i">{{i}}</option>
                                            </select>        
                                        </div> 
                                    </td>                                      
                                    <!-- VALOR POR DEFECTO SEGUN EL TIPO -->
                                    <td colspan="2">
                                        <div v-if="cdFormato=='C'" class="input-group addon">
                                            <label for="nuevo_cddefault">Valor inicial:</label>
                                            <input ref="nuevo_cddefault" id="nuevo_cdefault" type="text" class="form-control" :maxlength="cdAncho" style="width:60%;" v-model="cdValorDefault" placeholder="Valor inicial">
                                        </div>

                                        <div v-if="cdFormato=='D'" class="input-group addon">
                                            <label for="nuevo_cddefault">Valor inicial:</label>
                                            <input ref="nuevo_cddefault" id="nuevo_cddefault" type="date" class="form-control" :maxlength="cdAncho" style="width:60%;" v-model="cdValorDefault" placeholder="Valor inicial">
                                        </div> 
                                        <div v-if="cdFormato=='T'" class="input-group addon">
                                            <label for="nuevo_cddefault">Valor inicial:</label>
                                            <input ref="nuevo_cddefault" id="nuevo_cddefault" type="datetime-local" class="form-control" :maxlength="cdAncho" style="width:60%;" v-model="cdValorDefault" placeholder="Valor inicial">
                                        </div>    
                                        <div v-if="cdFormato=='H'" class="input-group addon">
                                            <label for="nuevo_cddefault">Valor inicial:</label>
                                            <input ref="nuevo_cddefault" id="nuevo_cddefault" type="time" class="form-control" :maxlength="cdAncho" style="width:60%;" v-model="cdValorDefault" placeholder="Valor inicial">
                                        </div>       
                                        <div v-if="cdFormato=='A'" class="input-group addon mb-3">
                                            <label for="nuevo_cddefault">Valor inicial:</label>
                                            <textarea ref="nuevo_cddefault" id="nuevo_cddefault" class="form-control" cols="50" :maxlength="cdAncho" style="width:100%;" v-model="cdValorDefault" placeholder="Valor inicial"></textarea>
                                        </div>
                                        <div v-if="cdFormato=='K'">
                                            <div class="input-group addon">
                                                <label for="nuevo_cddefault">Valor inicial:</label>
                                                <label class="content-input">
                                                    <input ref="nuevo_cddefault" id="nuevo_cddefault" type="checkbox" v-model="cdValorDefault">
                                                    <i></i>
                                                </label>                                              
                                            </div>
                                        </div>        
                                        <div v-if="cdFormato=='N' || cdFormato=='M'" class="input-group addon">
                                            <label for="nuevo_cddefault">Valor inicial:</label>
                                            <input 
                                                ref="nuevo_cddefault" 
                                                id="nuevo_cddefault" 
                                                type="text" style="width:60%;" 
                                                class="form-control" 
                                                v-model="cdValorDefault" 
                                                @blur="cdValidarDefault($event)"
                                                @keydown="noPuntos($event, false)"
                                                :title="`${'Valor máximo permitido: ' + cdValorMaximoDefault}`"> 
                                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="z-index:9999" v-if="cdDefError">Máx: {{cdValorMaximoDefault}}</span>
                                        </div>
                                        <div v-if="cdFormato=='F'">
                                            <inputPhone ref="nuevo_cddefault" class="text-start" style="position: relative;z-index:1000;" :valor="cdValorDefault" :maximo="cdAncho" @asigneValor="asignarTelefono"/>
                                        </div>                                        
                                        <div v-if="cdFormato=='E'" class="text-start input-group addon">
                                            <label for="nuevo_cddefault">Valor inicial:</label>
                                            <input type="email" ref="nuevo_cddefault" class="form-control" v-model="cdValorDefault" :maximo="cdAncho"/>
                                        </div>  
                                    </td>
                                    <!-- MENSAJE -->
                                    <td class="text-end" style="color:red;">
                                        {{cdMensaje}}
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <!-- LISTA DE VALORES -->
                                        <div v-if="cdFormato=='L'">
                                            <div class="text-start input-group addon">
                                                <div style="width:20%;">
                                                    <label>(*) Lista de valores:</label>
                                                </div>
                                                <div style="width:80%;">
                                                    <select ref="refcdListaval" class="form-select w-90" v-model="cdListaval" @change="cdCambiaListaVal()">
                                                        <option v-for="q of aListasVal" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="text-start input-group addon"> 
                                                <div style="width:20%;">       
                                                    <label>(*) Valor por defecto:</label>
                                                </div>
                                                <div style="width:80%;">
                                                    <select ref="refcdListavalDef" class="form-select w-90" v-model="cdValorDefault">
                                                        <option v-for="q of cdListaValValores" :key="q.id" :value="q.valor">{{q.descripcion}}</option>
                                                    </select>   
                                                </div>     
                                            </div>                                                         
                                        </div>                                                                                                       
                                        <!-- SELECTABLE -->
                                        <div v-if="cdFormato=='S'">
                                            <div class="text-start input-group addon">
                                                <div style="width:20%;">
                                                    <label>(*) Seleccionable:</label>
                                                </div>
                                                <div style="width:80%;">
                                                    <select ref="refcdListaval" class="form-select w-90" v-model="cdSelectable">
                                                        <option v-for="q of aSelectables" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>                                         
                                    </td>
                                </tr>

                            </table>
                        </div>
                        <!-- LISTA DE CAMPOS CARGA DE DATOS -->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                            <table >
                                <thead>
                                    <th>Etiqueta</th>
                                    <th>Formato</th>
                                    <th>Ancho</th>
                                    <th>Decimales</th>                                    
                                    <th>Valor por defecto</th>
                                    <th>Habilitado al inicio</th>
                                    <th></th>
                                </thead>
                                <tr v-for="registro of modelo.oCapturaDatos.Campos" :key="registro.id">
                                    <td>{{registro.etiqueta}}</td>
                                    <td>{{cTipos[cTipos.findIndex( x => x.id == registro.formato)].literal}}</td>
                                    <td>{{registro.ancho}}</td>
                                    <td>{{registro.decimales}}</td>                                    
                                    <td>
                                        <span v-if="registro.formato == 'K' && registro.valordefault == true">Si</span>
                                        <span v-if="registro.formato == 'K' && registro.valordefault == false">No</span>
                                        <span v-if="registro.formato != 'K'">{{registro.valordefault}}</span>
                                    </td>
                                    <td>
                                        <span v-if="registro.enabledinicial == true">Si</span>
                                        <span v-if="registro.enabledinicial == false">No</span>
                                    </td>
                                    <td>
                                        <span @click="cdQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                        <span @click="cdEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                    </td>
                                </tr>

                            </table>
                        </div>


                    </form>

                </div>

            </div>
            </div>

        </div>        

        <!-- LISTADO O INFORME -->
        <div id="datos-listado" class="container-fluid tab-pane fade " :class="{show : tab == 6, active : tab == 6}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Listado / Informe</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div class="btn-img text-end">
                            <h3 class="float-end">Consulta origen del listado</h3>
                            <span class="material-icons">radio_button_unchecked</span>
                        </div>     
                        <table>
                            <!-- QUERY -->
                            <tr class="text-start">
                                <td class="text-start" style="width: 30%;">
                                    <label>(*) Consulta de datos:</label>
                                </td>
                                <td class="text-start" style="width: 60%;">
                                    <select ref="liQuery" class="form-select" v-model="modelo.oListado.idQuery" @change="liCambioQuery()"> 
                                        <option v-for="q of aQuerys" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.id}} {{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="text-start" style="width: 10%;">
                                    <span v-if="modelo.oListado.idQuery == '0'" class="iconos inline-icon btn-img material-icons" title="Selecciona una consulta">visibility_off</span>
                                    <span @click="CargaConsulta(modelo.oListado.idQuery)" v-if="modelo.oListado.idQuery != '0'" class="iconos inline-icon btn-img material-icons" title="Ver consulta">visibility</span>
                                </td>
                            </tr>
                            <tr v-if="modelo.oListado.idQuery != '0' && liCadenaSQL != ''">
                                <td colspan="3"> 
                                    <div  class="w-100 input-group addon">
                                        <div class="container-fluid">
                                            <span @click="liCadenaSQL = ''" class="iconos inline-icon btn-img material-icons float-end" title="Cerrar">close</span>
                                        </div>
                                        <textarea ref="liConsultaSQL" id="liConsultaSQL" class="form-control" disabled rows="5" :maxlength="5000" style="height: auto;width: 100%;font-family:Courier;margin-bottom: 0;" v-model="liCadenaSQL" placeholder="Consulta SQL completa"></textarea>
                                    </div>
                                </td> 
                            </tr>
                            <tr v-if="modelo.oListado.idQuery != '0' && liCadenaSQL != ''">
                                <td colspan="3">
                                    <!-- LISTA DE FILTROS -->
                                    <div class="btn-img text-start">
                                        <h4>Filtros</h4>
                                    </div> 
                                    <div class="tableFixHead table-responsive" style="height:auto;">
                                    <table >
                                        <thead>
                                            <th>Etiqueta</th>
                                            <th>Tipo</th>
                                            <th>Obligatorio</th>
                                            <th>Variable en la consulta</th>
                                            <!-- <th>Valor por defecto</th> -->
                                        </thead>
                                        <tr v-for="registro of aFiltros" :key="registro.id">
                                            <td>{{registro.etiqueta}}</td>
                                            <td>{{registro.tipo_lit}}</td>
                                            <td>
                                                <span v-if="registro.obligatorio == true">Si</span>
                                                <span v-if="registro.obligatorio == false">No</span>                                                
                                            </td>
                                            <td>{{registro.variable}}</td>
                                            <!-- <td>{{registro.valordefecto}}</td> -->
                                        </tr>

                                    </table>
                                    </div>     
                                </td>                           
                            </tr>
                        
                        </table>
                        <!-- NUEVA COLUMNA -->
                        <div ref="liColumnas" class="btn-img text-end" @click="li_expanded = !li_expanded">
                            <h3 class="float-end">Columnas del informe</h3>
                            <span v-if="li_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="li_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="li_expanded">     

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- TITULO -->
                                    <td class="w-30">
                                        <div class="text-start input-group addon">
                                            <label>(*) T&iacute;tulo para la columna:</label>
                                            <input ref="refliTituloColumna" type="text" class="form-control" v-model="liTituloColumna" placeholder="Título para la columna">
                                        </div> 
                                    </td>
                                    <!-- CAMPO -->
                                    <td class="w-60">
                                        <div class="text-start input-group addon">
                                            <label>(*) Campo:</label>
                                            <select ref="refliCampoColumna" class="form-select" v-model="liCampoColumna">
                                                <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.descripcion">{{q.descripcion}}</option>
                                            </select>        
                                        </div>                            
                                    </td>
                                    <!-- BOTONES -->
                                    <td class="w-10">
                                        <span @click="liAgregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="liDescartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <td>
                                    </td> 
                                    <td>
                                    </td>                                     
                                    <td class="text-end" style="color:red;">
                                        {{liMensaje}}
                                    </td>
                                </tr>                                
                            </table>

                        </div>

                        <!-- LISTA DE COLUMNAS -->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table >
                            <thead>
                                <th>T&iacute;tulo</th>
                                <th>Campo</th>
                                <th>Acciones</th>
                            </thead>
                            <tr v-for="registro of modelo.oListado.Columnas" :key="registro.id">
                                <td>{{registro.titulo}}</td>
                                <td>{{registro.campo}}</td>
                                <td>
                                    <span @click="liQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="liEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>

                        <!-- PLANTILLA DE DOCUMENTO A UTILIZAR -->
                        <div class="btn-img text-end">
                            <h3 class="float-end">Plantilla para el informe</h3>
                            <span class="material-icons">radio_button_unchecked</span>
                        </div>                        
                        <table>
                            <tr class="text-start">
                                <td class="text-start" style="width: 30%;">
                                    <label>(*) Plantilla de documentos:</label>
                                </td>
                                <td class="text-start" style="width: 60%;">
                                    <select ref="liPlantilla" class="form-select" v-model="modelo.oListado.idPlantilla"> 
                                        <option v-for="q of aDocumentos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.id}} {{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="text-start" style="width: 30%;">
                                </td>
                            </tr>
                        
                        </table>



                    </form>

                </div>

            </div>
            </div>

        </div>  

        <!-- BUSCADOR -->
        <div id="datos-buscador" class="container-fluid tab-pane fade " :class="{show : tab == 7, active : tab == 7}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Buscador</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div class="btn-img text-end">
                            <h3 class="float-end">Consulta para realizar la búsqueda</h3>
                            <span class="material-icons">radio_button_unchecked</span>
                        </div>     
                        <table>
                            <!-- QUERY -->
                            <tr class="text-start">
                                <td class="text-start" style="width: 30%;">
                                    <label>(*) Consulta de datos:</label>
                                </td>
                                <td class="text-start" style="width: 60%;">
                                    <select ref="buQuery" class="form-select" v-model="modelo.oBuscador.idQuery" @change="buCambioQuery()"> 
                                        <option v-for="q of aQuerys" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.id}} {{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="text-start" style="width: 10%;">
                                    <span v-if="modelo.oBuscador.idQuery == '0'" class="iconos inline-icon btn-img material-icons" title="Selecciona una consulta">visibility_off</span>
                                    <span @click="CargaConsulta(modelo.oBuscador.idQuery)" v-if="modelo.oBuscador.idQuery != '0'" class="iconos inline-icon btn-img material-icons" title="Ver consulta">visibility</span>
                                </td>
                            </tr>
                            <tr v-if="modelo.oBuscador.idQuery != '0' && buCadenaSQL != ''">
                                <td colspan="3"> 
                                    <div  class="w-100 input-group addon">
                                        <div class="container-fluid">
                                            <span @click="buCadenaSQL = ''" class="iconos inline-icon btn-img material-icons float-end" title="Cerrar">close</span>
                                        </div>
                                        <textarea ref="buConsultaSQL" id="buConsultaSQL" class="form-control" disabled rows="5" :maxlength="5000" style="height: auto;width: 100%;font-family:Courier;margin-bottom: 0;" v-model="buCadenaSQL" placeholder="Consulta SQL"></textarea>
                                    </div>
                                </td> 
                            </tr>
                            <tr v-if="modelo.oBuscador.idQuery != '0' && buCadenaSQL != ''">
                                <td colspan="3">
                                    <!-- LISTA DE FILTROS -->
                                    <div class="btn-img text-start">
                                        <h4>Filtros</h4>
                                    </div> 
                                    <div class="tableFixHead table-responsive" style="height:auto;">
                                    <table >
                                        <thead>
                                            <th>Etiqueta</th>
                                            <th>Tipo</th>
                                            <th>Obligatorio</th>
                                            <th>Variable en la consulta</th>
                                            <!-- <th>Valor por defecto</th> -->
                                        </thead>
                                        <tr v-for="registro of aFiltros" :key="registro.id">
                                            <td>{{registro.etiqueta}}</td>
                                            <td>{{registro.tipo_lit}}</td>
                                            <td>
                                                <span v-if="registro.obligatorio == true">Si</span>
                                                <span v-if="registro.obligatorio == false">No</span>                                                
                                            </td>
                                            <td>{{registro.variable}}</td>
                                            <!-- <td>{{registro.valordefecto}}</td> -->
                                        </tr>

                                    </table>
                                    </div>     
                                </td>                           
                            </tr>
                        
                        </table>
                        <!-- NUEVA COLUMNA -->
                        <div ref="buColumnas" class="btn-img text-end" @click="bu_expanded = !bu_expanded">
                            <h3 class="float-end">Columnas del resultado</h3>
                            <span v-if="bu_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="bu_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="bu_expanded">     

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- TITULO -->
                                    <td class="w-30">
                                        <div class="text-start input-group addon">
                                            <label>(*) T&iacute;tulo para la columna:</label>
                                            <input ref="refbuTituloColumna" type="text" class="form-control" v-model="buTituloColumna" placeholder="Título para la columna">
                                        </div> 
                                    </td>
                                    <!-- CAMPO -->
                                    <td class="w-60">
                                        <div class="text-start input-group addon">
                                            <label>(*) Campo:</label>
                                            <select ref="refbuCampoColumna" class="form-select" v-model="buCampoColumna">
                                                <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                            </select>        
                                        </div>                            
                                    </td>
                                    <!-- BOTONES -->
                                    <td class="w-10">
                                        <span @click="buAgregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="buDescartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <td>
                                    </td> 
                                    <td>
                                    </td>                                     
                                    <td class="text-end" style="color:red;">
                                        {{buMensaje}}
                                    </td>
                                </tr>                                
                            </table>

                        </div>

                        <!-- LISTA DE COLUMNAS -->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table >
                            <thead>
                                <th>T&iacute;tulo</th>
                                <th>Campo</th>
                                <th>Acciones</th>
                            </thead>
                            <tr v-for="registro of modelo.oBuscador.Columnas" :key="registro.id">
                                <td>{{registro.titulo}}</td>
                                <td>{{registro.campo}}</td>
                                <td>
                                    <span @click="buQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="buEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>

                        <!-- CAMPO DEVOLVER -->
                        <div class="btn-img text-end">
                            <h3 class="float-end">Campo para devolver el dato seleccionado</h3>
                            <span class="material-icons">radio_button_unchecked</span>
                        </div> 
                        <table>
                            <tr>
                                <td class="text-start" style="width: 30%;">
                                    <label>(*) Campo para devolver seleccionado:</label>
                                </td>
                                <td class="text-start input-group addon" style="width: 60%;">
                                    <select ref="refbuDevolverValor" class="form-select" v-model="modelo.oBuscador.devolverValor">
                                        <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                    </select> 
                                </td>
                                <td></td>
                            </tr>
                            
                        </table>


                    </form>

                </div>

            </div>
            </div>

        </div>  

        <!-- SELECTOR -->
        <div id="datos-selector" class="container-fluid tab-pane fade " :class="{show : tab == 8, active : tab == 8}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Selector</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div class="btn-img text-end">
                            <h3 class="float-end">Consulta para obtener la lista de seleccionables</h3>
                            <span class="material-icons">radio_button_unchecked</span>
                        </div>     
                        <table>
                            <!-- QUERY -->
                            <tr class="text-start">
                                <td class="text-start" style="width: 30%;">
                                    <label>(*) Consulta de datos:</label>
                                </td>
                                <td class="text-start" style="width: 60%;">
                                    <select ref="seQuery" class="form-select" v-model="modelo.oSelector.idQuery" @change="seCambioQuery()"> 
                                        <option v-for="q of aQuerys" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.id}} {{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="text-start" style="width: 10%;">
                                    <span v-if="modelo.oSelector.idQuery == '0'" class="iconos inline-icon btn-img material-icons" title="Selecciona una consulta">visibility_off</span>
                                    <span @click="CargaConsulta(modelo.oSelector.idQuery)" v-if="modelo.oSelector.idQuery != '0'" class="iconos inline-icon btn-img material-icons" title="Ver consulta">visibility</span>
                                </td>
                            </tr>
                            <tr v-if="modelo.oSelector.idQuery != '0' && seCadenaSQL != ''">
                                <td colspan="3"> 
                                    <div class="w-100 input-group addon">
                                        <div class="container-fluid">
                                            <span @click="seCadenaSQL = ''" class="iconos inline-icon btn-img material-icons float-end" title="Cerrar">close</span>
                                        </div>
                                        <textarea ref="seConsultaSQL" id="seConsultaSQL" class="form-control" disabled rows="5" :maxlength="5000" style="height: auto;width: 100%;font-family:Courier;margin-bottom: 0;" v-model="seCadenaSQL" placeholder="Consulta SQL"></textarea>
                                    </div>
                                </td> 
                            </tr>
                            <tr v-if="modelo.oSelector.idQuery != '0' && seCadenaSQL != ''">
                                <td colspan="3">
                                    <!-- LISTA DE FILTROS -->
                                    <div class="btn-img text-start">
                                        <h4>Filtros</h4>
                                    </div> 
                                    <div class="tableFixHead table-responsive" style="height:auto;">
                                    <table >
                                        <thead>
                                            <th>Etiqueta</th>
                                            <th>Tipo</th>
                                            <th>Obligatorio</th>
                                            <th>Variable en la consulta</th>
                                            <!-- <th>Valor por defecto</th> -->
                                        </thead>
                                        <tr v-for="registro of aFiltros" :key="registro.id">
                                            <td>{{registro.etiqueta}}</td>
                                            <td>{{registro.tipo_lit}}</td>
                                            <td>
                                                <span v-if="registro.obligatorio == true">Si</span>
                                                <span v-if="registro.obligatorio == false">No</span>                                                
                                            </td>
                                            <td>{{registro.variable}}</td>
                                            <!-- <td>{{registro.valordefecto}}</td> -->
                                        </tr>

                                    </table>
                                    </div>     
                                </td>                           
                            </tr>
                            <tr>
                                <td class="text-start" style="width: 30%;">
                                    <label>(*) Límite de registros seleccionables (0 = sin limites):</label>
                                </td>
                                <td>
                                    <div class="text-start input-group addon" style="width: 30%;"> 
                                        <input type="text" class="form-control" v-model="modelo.oSelector.maxSeleccion" @keydown="noPuntos($event, true)">
                                    </div>
                                </td>
                                <td style="width: 10%;"></td>
                            </tr>
                        
                        </table>

                        <!-- DATOS PARA SELECCION -->
                        <div ref="seColumnasO" class="btn-img text-end" @click="se_expandedO = !se_expandedO">
                            <h3 class="float-end">Columnas para los registros seleccionables</h3>
                            <span v-if="se_expandedO == false" class="material-icons">add_circle_outline</span>
                            <span v-if="se_expandedO == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="se_expandedO">     

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- TITULO -->
                                    <td class="w-30">
                                        <div class="text-start input-group addon">
                                            <label>(*) T&iacute;tulo para la columna:</label>
                                            <input ref="refseTituloColumnaO" type="text" class="form-control" v-model="seTituloColumnaO" placeholder="Título para la columna">
                                        </div> 
                                    </td>
                                    <!-- CAMPO -->
                                    <td class="w-60">
                                        <div class="text-start input-group addon">
                                            <label>(*) Campo:</label>
                                            <select ref="refseCampoColumnaO" class="form-select" v-model="seCampoColumnaO">
                                                <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                            </select>        
                                        </div>                            
                                    </td>
                                    <!-- BOTONES -->
                                    <td class="w-10">
                                        <span @click="seAgregarO()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="seDescartarO()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <td>
                                    </td> 
                                    <td>
                                    </td>                                     
                                    <td class="text-end" style="color:red;">
                                        {{seMensajeO}}
                                    </td>
                                </tr>                                
                            </table>

                        </div>

                        <!-- LISTA DE COLUMNAS EN LOS SELECCIONABLES-->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table >
                            <thead>
                                <th>T&iacute;tulo</th>
                                <th>Campo</th>
                                <th>Acciones</th>
                            </thead>
                            <tr v-for="registro of modelo.oSelector.ColumnasO" :key="registro.id">
                                <td>{{registro.titulo}}</td>
                                <td>{{registro.camponombre}}</td>
                                <td>
                                    <span @click="seQuitarO(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="seEditarO(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>

                        <!-- DATOS PARA SELECCIONADOS -->
                        <div ref="seColumnasD" class="btn-img text-end" @click="se_expandedD = !se_expandedD">
                            <h3 class="float-end">Columnas para los registros seleccionables</h3>
                            <span v-if="se_expandedD == false" class="material-icons">add_circle_outline</span>
                            <span v-if="se_expandedD == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="se_expandedD">     

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- TITULO -->
                                    <td class="w-30">
                                        <div class="text-start input-group addon">
                                            <label>(*) T&iacute;tulo para la columna:</label>
                                            <input ref="refseTituloColumnaD" type="text" class="form-control" v-model="seTituloColumnaD" placeholder="Título para la columna">
                                        </div> 
                                    </td>
                                    <!-- CAMPO -->
                                    <td class="w-60">
                                        <div class="text-start input-group addon">
                                            <label>(*) Campo:</label>
                                            <select ref="refseCampoColumnaD" class="form-select" v-model="seCampoColumnaD">
                                                <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.descripcion}}</option>
                                            </select>        
                                        </div>                            
                                    </td>
                                    <!-- BOTONES -->
                                    <td class="w-10">
                                        <span @click="seAgregarD()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="seDescartarD()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <td>
                                    </td> 
                                    <td>
                                    </td>                                     
                                    <td class="text-end" style="color:red;">
                                        {{seMensajeD}}
                                    </td>
                                </tr>                                
                            </table>

                        </div>             

                        <!-- LISTA DE COLUMNAS SELECCIONADOS -->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table >
                            <thead>
                                <th>T&iacute;tulo</th>
                                <th>Campo</th>
                                <th>Acciones</th>
                            </thead>
                            <tr v-for="registro of modelo.oSelector.ColumnasD" :key="registro.id">
                                <td>{{registro.titulo}}</td>
                                <td>{{registro.camponombre}}</td>
                                <td>
                                    <span @click="seQuitarD(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="seEditarD(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>                                   

                    </form>

                </div>

            </div>
            </div>

        </div>  

        <!-- JSON -->
        <div id="datos-JSON" class="container-fluid tab-pane fade " :class="{show : tab == 9, active : tab == 9}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>JSON</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">
                        <truetree :treemodelo="modelo"/>
                    </form>

                </div>

            </div>
            </div>

        </div>  

    </div> 

</div>
</template>

<script>

import datos from '@/utils/datos'
import funciones from '@/utils/funciones'
import telon from '@/components/visuales/telon'
import truetree from '@/components/visuales/truetree'
import inputPhone from '@/components/visuales/inputPhone'

export default {
    name: 'NewScreen',
    data() {

        return {
            tab: 1,
            hiddentelon: true,
            claveId: '',
            errores: [], error_grave: 0, error_warning: 0,
            E_expanded: false,
            dTipos: [
                {id: '0', literal: "Selecciona ..."},
                {id: 'G', literal: "Tabla de gestiones"},
                {id: 'C', literal: "CRUD (un registro: create / update)"},
                {id: 'D', literal: "Capturar/Informar datos"},
                {id: 'I', literal: "Listado o Informe"},
                {id: 'B', literal: "Buscador"},
                {id: 'S', literal: "Selector"},
            ],
            cTipos: [
                {id: '0', literal: 'Formato de edición ...', anchoDefault: 0, decimalesDefault: 0},
                {id: 'C', literal: 'Texto', anchoDefault: 50, decimalesDefault: 0},
                {id: 'E', literal: 'Correo electrónico', anchoDefault: 100, decimalesDefault: 0},
                {id: 'F', literal: 'Teléfono', anchoDefault: 9, decimalesDefault: 0},
                {id: 'N', literal: 'Numérico', anchoDefault: 10, decimalesDefault: 0},
                {id: 'M', literal: 'Moneda', anchoDefault: 10, decimalesDefault: 2},
                {id: 'D', literal: 'Fecha', anchoDefault: 0, decimalesDefault: 0},
                {id: 'T', literal: 'Fecha y hora', anchoDefault: 0, decimalesDefault: 0},
                {id: 'H', literal: 'Hora', anchoDefault: 0, decimalesDefault: 0},
                {id: 'K', literal: 'Si/No', anchoDefault: 0, decimalesDefault: 0},
                {id: 'A', literal: 'Area de texto', anchoDefault: 2000, decimalesDefault: 0},
                {id: 'L', literal: 'Lista de valores', anchoDefault: 0, decimalesDefault: 0},
                {id: 'S', literal: 'Seleccionable', anchoDefault: 0, decimalesDefault: 0},
            ],            
            aListasVal: [],
            aQuerys: [],
            aTablas: [],
            aSelectables: [],
            aCampos: [{id:'0', descripcion: 'Seleccionar ...'}],
            aDocumentos: [],
            aFiltros: [],
            aPantallasC: [],
            aPantallasI: [],
            // Tabla de gestion
            tgidQueryOld: '0',
            tg_id: funciones.generarUUID2(),
            tg_expanded: false,
            tgMensaje: '',
            tgCadenaSQL: '',
            tgTituloColumna: '',
            tgCampoColumna: '',
            tgOrdenarColumna: false,
            tgFiltrarColumna: false,
            // CRUD
            cr1_id: funciones.generarUUID2(),
            cr1_expanded: false,
            cr1Mensaje: '', 
            // Campos
            cr1Campos: [],
            cr1ListaValValores: [],
            cr1Selectables: [],
            cr1Campo: '0',
            cr1Etiqueta: '',
            cr1Formato: '0',
            cr1ValorDefault: '',
            cr1EnabledInicial: false, 
            cr1Listaval:'0', 
            cr1Selectable: '0',  
            // Captura de datos
            cd_id: funciones.generarUUID2(),
            cd_expanded: false,
            cdMensaje: '', 
            cdCampos: [],
            cdListaValValores: [],
            cdSelectables: [],
            cdEtiqueta: '',
            cdFormato: '0',
            cdAncho: 0,
            cdDecimales: 0,
            cdValorDefault: '',
            cdEnabledInicial: true, 
            cdListaval:'0', 
            cdSelectable: '0', 
            // Listado/Informe
            liidQueryOld: '0',
            li_id: funciones.generarUUID2(),
            li_expanded: false,
            liMensaje: '',
            liCadenaSQL: '',
            liTituloColumna: '',
            liCampoColumna: '',
            // Buscador
            buidQueryOld: '0',
            bu_id: funciones.generarUUID2(),
            bu_expanded: false,
            buMensaje: '',
            buCadenaSQL: '',
            buTituloColumna: '',
            buCampoColumna: '0',
            // Selector
            seCadenaSQL: '',
            seidQueryOld: '0',
            se_idO: funciones.generarUUID2(),
            se_idD: funciones.generarUUID2(),
            se_expandedO: false,
            se_expandedD: false,
            seMensajeO: '',
            seMensajeD: '',
            seTituloColumnaO: '',
            seCampoColumnaO: '0',             
            seTituloColumnaD: '',
            seCampoColumnaD: '0',            
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
                    Row_agregar: false,
                    Row_listar: false,
                    Row_editar: false,
                    Row_eliminar: false,
                    PantallaAdd: '0',
                    PantallaList: '0',
                    PantallaEdit: '0',
                },
                oCRUD01: {
                    tabla: '0',
                    Campos: [],
                },
                oCapturaDatos: {
                    Campos: []
                },
                oListado: {
                    idQuery: '0',
                    Columnas: [],
                    idPlantilla: '0'                
                },
                oBuscador: {
                    idQuery: '0',
                    Columnas: [],
                    devolverValor: '0'
                },
                oSelector: {
                    idQuery: '0',
                    ColumnasO: [],
                    ColumnasD: [],
                    maxSeleccion: 0
                }     
            }

            
        }
    },
    components:{
        telon,
        truetree,
        inputPhone,
    },
    methods: {
        cero(e) {
            e.preventDefault();
        },  
        enfocar(referencia, tabulacion) {
            this.tab = tabulacion;
            if(referencia != null) {
                this.$nextTick(() => {
                    if(this.$refs[referencia]) {
                        this.$refs[referencia].focus();
                    }
                })
            }

        },        
        errDescripcion(pCodigo, que) {
            let err = funciones.tablaErrores(pCodigo);
            if(que == 'L')
                return err.literal;

            if(que == 'C')
                return err.criticidad;

        }, 
        noPuntos(ev, niComa) {
            funciones.noPuntos(ev, niComa);
        },
        leerModelosDatos() {

            try {

                this.aListasVal = [{
                    id: '0',
                    descripcion: 'Selecciona una lista de valores ...',
                    valores: []
                }];
                this.aQuerys = [{
                    id: '0',
                    descripcion: 'Selecciona una consulta ...',                    
                    cadenaSQL: '0',
                    filtros: [],
                    campos: []                    
                }];                
                this.aTablas = [{
                    id: '0',
                    descripcion: 'Selecciona una tabla ...',
                    nombre_tabla: '',
                    campos: []                    
                }];
                this.aSelectables = [{
                    id: '0',
                    descripcion: 'Selecciona un Seleccionable ...',                
                    idQuery: '0',
                    campo_valor: '',
                    campo_descripcion: ''                    
                }];
                this.aPantallasC = [{
                    id: '0',
                    descripcion: 'Selecciona una pantalla ...',
                }];
                this.aPantallasI = [{
                    id: '0',
                    descripcion: 'Selecciona una pantalla ...',
                }];

                datos.leerLista("sys_modelo_datos", "1=1", ["clave", "id", "tipo", "descripcion", "objeto"], "descripcion")
                .then((result) => {

                    if(global.DEBUG)
                        console.log("leerModelosDatos", "datos devueltos datos.leerModelosDatos", result);

                    if(result.success == 1 && result.status == 200) {

                        // Cargar los arrays principales
                        for(let x = 0; x < result.data.length; x++) {

                            let tmp_modelo = JSON.parse(result.data[x].objeto.split('&quot;').join('"'));

                            // LISTAS DE VALORES
                            if(result.data[x].tipo == 'L') {

                                let lValores = [];

                                // Hacer el parse de los valores de la lista de valores
                                for(let z = 0; z < tmp_modelo.oLista.length; z++) {
                                    lValores.push({
                                        id:          tmp_modelo.oLista[z].id,
                                        codigo:      tmp_modelo.oLista[z].codigo,
                                        valor:       tmp_modelo.oLista[z].valor,
                                        descripcion: tmp_modelo.oLista[z].descripcion,
                                        orden:       tmp_modelo.oLista[z].orden
                                    })
                                }
                                this.aListasVal.push({
                                    id:          result.data[x].id,
                                    descripcion: result.data[x].descripcion,
                                    valores:     lValores
                                })

                            }
                            // TABLAS
                            if(result.data[x].tipo == 'T') {

                                let tCampos = [{
                                    id: '0',
                                    descripcion: 'Selecciona un campo ...'                                    
                                }];

                                // Hacer el parse de los campos de la tabla
                                for(let z = 0; z < tmp_modelo.oTabla.oCampos.length; z++) {
                                    tCampos.push({
                                        id:          tmp_modelo.oTabla.oCampos[z].id,
                                        descripcion: tmp_modelo.oTabla.oCampos[z].nombre,
                                        tipo:        tmp_modelo.oTabla.oCampos[z].tipo,
                                        ancho:       tmp_modelo.oTabla.oCampos[z].ancho,
                                        decimales:   tmp_modelo.oTabla.oCampos[z].decimales,
                                        etiqueta:    tmp_modelo.oTabla.oCampos[z].etiqueta,
                                        default:     tmp_modelo.oTabla.oCampos[z].default
                                    })
                                }

                                this.aTablas.push({
                                    id:           result.data[x].id,
                                    descripcion:  result.data[x].descripcion,
                                    nombre_tabla: tmp_modelo.oTabla.nombre,
                                    campos:       tCampos                                    
                                })

                            }
                            // QUERYS
                            if(result.data[x].tipo == 'Q') {

                                let tmp_CadenaSQL = tmp_modelo.oQuery.cadenaSQL;
                                let qCampos = [{
                                    id: '0',
                                    descripcion: '"Selecciona un campo ...'
                                }];
                                let qFiltros = [];

                                // Recuperar los filtros de la consulta
                                for(let z = 0; z < tmp_modelo.oQuery.oFiltros.length; z++) {

                                    let xtipo = this.cTipos[this.cTipos.findIndex(x => x.id === tmp_modelo.oQuery.oFiltros[z].tipo)].literal;

                                    qFiltros.push({
                                        etiqueta:     tmp_modelo.oQuery.oFiltros[z].etiqueta,
                                        tipo:         tmp_modelo.oQuery.oFiltros[z].tipo,
                                        tipo_lit:     xtipo,
                                        obligatorio:  tmp_modelo.oQuery.oFiltros[z].obligatorio,
                                        variable:     tmp_modelo.oQuery.oFiltros[z].campo,
                                        valordefecto: tmp_modelo.oQuery.oFiltros[z].valor
                                    })

                                }

                                // Hacer el parse de los campos de la consulta
                                funciones.parseSQL(tmp_CadenaSQL)
                                .then((result) => {

                                    if(result.success == 1 && result.status == 200) {
                                        
                                        let c = 1;

                                        for(let x=0; x < result.data.SELECT.length; x++) {
                                            if(result.data.SELECT[x].base_expr != '*') {
                                                qCampos.push({
                                                    id: c,
                                                    descripcion: result.data.SELECT[x].base_expr
                                                })
                                                c++;
                                            }
                                        }

                                    }

                                })                                 

                                this.aQuerys.push({
                                    id:           result.data[x].id,
                                    descripcion:  result.data[x].descripcion,
                                    cadenaSQL:    tmp_CadenaSQL,
                                    campos:       qCampos,
                                    filtros:      qFiltros                                       
                                })

                            }
                            // SELECTABLES
                            if(result.data[x].tipo == 'I') {

                                this.aSelectables.push({
                                    id:          result.data[x].id,
                                    descripcion: result.data[x].descripcion,
                                    idQuery:     tmp_modelo.oSelectable.idQuery,
                                    campo_valor: tmp_modelo.oSelectable.campo_valor,
                                    campo_descripcion: tmp_modelo.oSelectable.campo_descripcion                                      
                                })

                            }

                        }

                        // Cargar la lista de plantillas de documentos
                        this.leerPlantillasDoc();

                        // Carga las pantallas
                        this.leerPantallas();

                        // Modo edición, cargar datos
                        if(this.claveId != null) {
                            this.LeerDatos();
                        }                        

                    }
                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch(error) {
                console.log(error);
            }

        },     
        leerPlantillasDoc() {

            try {

                this.aDocumentos = [{
                    id: '0',
                    descripcion: 'Selecciona una plantilla para el documento ...',
                    valores: []
                }];

                datos.leerLista("sys_documentos", "1=1", ["id", "titulo"], "titulo")
                .then((result) => {

                    if(global.DEBUG)
                        console.log("leerPlantillasDoc", "datos devueltos datos.leerPlantillasDoc", result);

                    if(result.success == 1 && result.status == 200) {

                        // Cargar la lista de documentos
                        for(let x = 0; x < result.data.length; x++) {

                            this.aDocumentos.push({
                                id:          result.data[x].id,
                                descripcion: result.data[x].titulo
                            })


                        }

                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch(error) {
                console.log(error);
            }

        },       
        leerPantallas() {
 
            try {
                // Leer las pantallas
                datos.leerLista("sys_screens", "tipo='C' OR tipo='I'", ["id", "titulo", "tipo"], "titulo")
                .then((result) => {

                    if (global.DEBUG)
                        console.log("leerPantallas", "datos devueltos datos.leerPantallas", result);

                    if (result.success == 1 && result.status == 200) {

                        // Cargar la lista de documentos
                        for (let x = 0; x < result.data.length; x++) {

                            if (result.data[x].tipo == 'C') {
                                this.aPantallasC.push({
                                    id: result.data[x].id,
                                    descripcion: result.data[x].titulo
                                })
                            }
                            if (result.data[x].tipo == 'I') {
                                this.aPantallasI.push({
                                    id: result.data[x].id,
                                    descripcion: result.data[x].titulo
                                })
                            }

                        }
                    }
                }).finally(() => {
                    this.hiddentelon = true;              
                }) 

            } catch(error) {
                console.log(error);
            }

        },         
        LeerDatos() {

            try {

                this.hiddentelon = false;

                datos.leerLista('sys_screens', "id='" + this.claveId + "'", ['objeto'], '')
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        this.modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                        if(this.modelo.oDisenio.tipo == 'G' && this.modelo.oTablaGestiones.idQuery != '0') {
                            this.cargaCamposConsulta(this.modelo.oTablaGestiones.idQuery);
                        }
                        if(this.modelo.oCRUD01.tabla) {
                            this.cargaCamposTabla(this.modelo.oCRUD01.tabla);
                        } 
                        if(this.modelo.oDisenio.tipo == 'I' && this.modelo.oListado.idQuery != '0') {
                            this.cargaCamposConsulta(this.modelo.oListado.idQuery);
                        }                        
                        if(this.modelo.oDisenio.tipo == 'B' && this.modelo.oBuscador.idQuery != '0') {
                            this.cargaCamposConsulta(this.modelo.oBuscador.idQuery);
                        }  
                        if(this.modelo.oDisenio.tipo == 'S' && this.modelo.oSelector.idQuery != '0') {
                            this.cargaCamposConsulta(this.modelo.oSelector.idQuery);
                        }                         
                    }
                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch(error) {
                console.log(error);
            }

        },
        cr1ValidarDefault(e) {  

            // Dar format numérico al valor
            let monetario = null;
            if(this.cr1Formato == 'M')
                monetario = global.currencySimbol;

            this.cr1ValorDefault = funciones.formatNumber(e.target.value, monetario, this.tdecimales);

            if(this.cr1DefError) {
                this.$refs.nuevo_cr1Default.focus();
            }

        },
        cdValidarDefault(e) {  

            // Dar format numérico al valor
            let monetario = null;
            if(this.cdFormato == 'M')
                monetario = global.currencySimbol;

            this.cdValorDefault = funciones.formatNumber(e.target.value, monetario, this.cdDecimales);

            if(this.cdDefError) {
                this.$refs.nuevo_cddefault.focus();
            }            

        },        
        Numerico(pval) {
            return pval.replace('.',',').replace(',','.');
        },                 
        LimpiaModelo() {

            this.errores = [];
            this.error_grave = 0;
            this.error_warning = 0;

            // Eliminar el CRUD00 reemplazado por la Tabla de gestiones
            delete this.modelo.oCRUD00;

            // Limpiar los objetos que no aplican
            switch(this.modelo.oDisenio.tipo) {
            case 'G':   // Tabla de gestiones

                // this.modelo.oTablaGestiones.idQuery      = 0,
                // this.modelo.oTablaGestiones.Columnas     = [];
                // this.modelo.oTablaGestiones.Row_agregar  = false,
                // this.modelo.oTablaGestiones.Row_listar   = false,
                // this.modelo.oTablaGestiones.Row_editar   = false,
                // this.modelo.oTablaGestiones.Row_eliminar = false,

                this.modelo.oCRUD01.tabla          = '0';
                this.modelo.oCRUD01.Campos         = [];

                this.modelo.oCapturaDatos.Campos = [];
                
                this.modelo.oListado.idQuery     = '0';
                this.modelo.oListado.Columnas    = [];
                this.modelo.oListado.idPlantilla = '0';                

                this.modelo.oBuscador.idQuery = '0';
                this.modelo.oBuscador.Columnas = [];
                this.modelo.oBuscador.devolverValor = '0';

                this.modelo.oSelector.idQuery = '0';
                this.modelo.oSelector.ColumnasO = [];
                this.modelo.oSelector.ColumnasD = [];
                this.modelo.oSelector.maxSeleccion = 0;

                break;   

            case 'C':   // CRUD (create, read, update, delete)

                this.modelo.oTablaGestiones.idQuery      = 0,
                this.modelo.oTablaGestiones.Columnas     = [];
                this.modelo.oTablaGestiones.Row_agregar  = false;
                this.modelo.oTablaGestiones.Row_listar   = false;
                this.modelo.oTablaGestiones.Row_editar   = false;
                this.modelo.oTablaGestiones.Row_eliminar = false;
                this.modelo.oTablaGestiones.PantallaAdd  = '0';
                this.modelo.oTablaGestiones.PantallaList = '0';
                this.modelo.oTablaGestiones.PantallaEdit = '0';

                // this.modelo.oCRUD01.tabla          = '0';
                // this.modelo.oCRUD01.Campos         = [];

                this.modelo.oCapturaDatos.Campos = [];
                
                this.modelo.oListado.idQuery     = '0';
                this.modelo.oListado.Columnas    = [];
                this.modelo.oListado.idPlantilla = '0';                

                this.modelo.oBuscador.idQuery = '0';
                this.modelo.oBuscador.Columnas = [];
                this.modelo.oBuscador.devolverValor = '0';

                this.modelo.oSelector.idQuery = '0';
                this.modelo.oSelector.ColumnasO = [];
                this.modelo.oSelector.ColumnasD = [];
                this.modelo.oSelector.maxSeleccion = 0;

                break; 

            case 'D':   // Capturar/Informar datos

                this.modelo.oTablaGestiones.idQuery      = 0,
                this.modelo.oTablaGestiones.Columnas     = [];
                this.modelo.oTablaGestiones.Row_agregar  = false;
                this.modelo.oTablaGestiones.Row_listar   = false;
                this.modelo.oTablaGestiones.Row_editar   = false;
                this.modelo.oTablaGestiones.Row_eliminar = false;
                this.modelo.oTablaGestiones.PantallaAdd  = '0';
                this.modelo.oTablaGestiones.PantallaList = '0';
                this.modelo.oTablaGestiones.PantallaEdit = '0';

                this.modelo.oCRUD01.tabla          = '0';
                this.modelo.oCRUD01.Campos         = [];

                // this.modelo.oCapturaDatos.Campos = [];
                
                this.modelo.oListado.idQuery     = '0';
                this.modelo.oListado.Columnas    = [];
                this.modelo.oListado.idPlantilla = '0';                

                this.modelo.oBuscador.idQuery = '0';
                this.modelo.oBuscador.Columnas = [];
                this.modelo.oBuscador.devolverValor = '0';

                this.modelo.oSelector.idQuery = '0';
                this.modelo.oSelector.ColumnasO = [];
                this.modelo.oSelector.ColumnasD = [];
                this.modelo.oSelector.maxSeleccion = 0;

                break;    
                
            case 'I':   // Listado o Informe

                this.modelo.oTablaGestiones.idQuery      = 0,
                this.modelo.oTablaGestiones.Columnas     = [];
                this.modelo.oTablaGestiones.Row_agregar  = false;
                this.modelo.oTablaGestiones.Row_listar   = false;
                this.modelo.oTablaGestiones.Row_editar   = false;
                this.modelo.oTablaGestiones.Row_eliminar = false;
                this.modelo.oTablaGestiones.PantallaAdd  = '0';
                this.modelo.oTablaGestiones.PantallaList = '0';
                this.modelo.oTablaGestiones.PantallaEdit = '0';

                this.modelo.oCRUD01.tabla          = '0';
                this.modelo.oCRUD01.Campos         = [];

                this.modelo.oCapturaDatos.Campos = [];
                
                // this.modelo.oListado.idQuery     = '0';
                // this.modelo.oListado.Columnas    = [];
                // this.modelo.oListado.idPlantilla = '0';                

                this.modelo.oBuscador.idQuery = '0';
                this.modelo.oBuscador.Columnas = [];
                this.modelo.oBuscador.devolverValor = '0';

                this.modelo.oSelector.idQuery = '0';
                this.modelo.oSelector.ColumnasO = [];
                this.modelo.oSelector.ColumnasD = [];
                this.modelo.oSelector.maxSeleccion = 0;

                break;      
                
            case 'B':   // Buscador

                this.modelo.oTablaGestiones.idQuery      = 0,
                this.modelo.oTablaGestiones.Columnas     = [];
                this.modelo.oTablaGestiones.Row_agregar  = false;
                this.modelo.oTablaGestiones.Row_listar   = false;
                this.modelo.oTablaGestiones.Row_editar   = false;
                this.modelo.oTablaGestiones.Row_eliminar = false;
                this.modelo.oTablaGestiones.PantallaAdd  = '0';
                this.modelo.oTablaGestiones.PantallaList = '0';
                this.modelo.oTablaGestiones.PantallaEdit = '0';

                this.modelo.oCRUD01.tabla          = '0';
                this.modelo.oCRUD01.Campos         = [];

                this.modelo.oCapturaDatos.Campos = [];
                
                this.modelo.oListado.idQuery     = '0';
                this.modelo.oListado.Columnas    = [];
                this.modelo.oListado.idPlantilla = '0';                

                // this.modelo.oBuscador.idQuery = '0';
                // this.modelo.oBuscador.Columnas = [];
                // this.modelo.oBuscador.devolverValor = '0';

                this.modelo.oSelector.idQuery = '0';
                this.modelo.oSelector.ColumnasO = [];
                this.modelo.oSelector.ColumnasD = [];
                this.modelo.oSelector.maxSeleccion = 0;

                break;        
                
            case 'S':   // Selector

                this.modelo.oTablaGestiones.idQuery      = 0,
                this.modelo.oTablaGestiones.Columnas     = [];
                this.modelo.oTablaGestiones.Row_agregar  = false;
                this.modelo.oTablaGestiones.Row_listar   = false;
                this.modelo.oTablaGestiones.Row_editar   = false;
                this.modelo.oTablaGestiones.Row_eliminar = false;
                this.modelo.oTablaGestiones.PantallaAdd  = '0';
                this.modelo.oTablaGestiones.PantallaList = '0';
                this.modelo.oTablaGestiones.PantallaEdit = '0';

                this.modelo.oCRUD01.tabla          = '0';
                this.modelo.oCRUD01.Campos         = [];

                this.modelo.oCapturaDatos.Campos = [];
                
                this.modelo.oListado.idQuery     = '0';
                this.modelo.oListado.Columnas    = [];
                this.modelo.oListado.idPlantilla = '0';                

                this.modelo.oBuscador.idQuery = '0';
                this.modelo.oBuscador.Columnas = [];
                this.modelo.oBuscador.devolverValor = '0';

                // this.modelo.oSelector.idQuery = '0';
                // this.modelo.oSelector.ColumnasO = [];
                // this.modelo.oSelector.ColumnasD = [];
                // this.modelo.oSelector.maxSeleccion = 0;

                break;                 
            }

        },
        async Validaciones() {

            this.errores = [];
            this.error_grave = 0;
            this.error_warning = 0;

            this.LimpiaModelo();

            // Datos generales
            if(this.modelo.oDatosGenerales.titulo == '') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado el título para la definición",
                    ref: 'scrTitulo',
                    tab: 1
                })
                this.error_grave++;
            }
            if(this.modelo.oDatosGenerales.version == 0) {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado el número de versión",
                    ref: 'scrVersion',
                    tab: 1
                })
                this.error_grave++;
            }

            // Diseño
            if(this.modelo.oDisenio.titulo == '') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado el título para la pantalla",
                    ref: 'scrDisenioTitulo',
                    tab: 2
                })
                this.error_grave++;
            }            
            if(this.modelo.oDisenio.tipo == 0) {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado el tipo de pantalla",
                    ref: 'scrTipo',
                    tab: 2
                })
                this.error_grave++;
            }

            switch(this.modelo.oDisenio.tipo) {
            case 'G':               
                // Tabla de gestiones            
                if(this.modelo.oTablaGestiones.idQuery == '0') {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Tabla de gestiones es obligatorio indicar la consulta",
                        ref: 'tgQuery',
                        tab: 3
                    })
                    this.error_grave++;
                }
            
                if(this.modelo.oTablaGestiones.Columnas.length == 0) {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Tabla de gestiones es obligatorio indicar las columnas",
                        ref: 'tgQuery',
                        tab: 3
                    })
                    this.error_grave++;
                }    

                if (!this.modelo.oTablaGestiones.Row_agregar) {
                    this.modelo.oTablaGestiones.PantallaAdd = '0';
                }
                if (!this.modelo.oTablaGestiones.Row_listar) {
                    this.modelo.oTablaGestiones.PantallaList = '0';
                }
                if (!this.modelo.oTablaGestiones.Row_editar) {
                    this.modelo.oTablaGestiones.PantallaEdit = '0';
                }
                    
                if(this.modelo.oTablaGestiones.Row_agregar == true && this.modelo.oTablaGestiones.PantallaAdd == '0' ) {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para la pantalla a utilizar para añadir registros nuevos",
                        ref: 'tgQuery',
                        tab: 3
                    })
                    this.error_grave++;
                } 

                if(this.modelo.oTablaGestiones.Row_listar == true && this.modelo.oTablaGestiones.PantallaList == '0' ) {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para la pantalla a utilizar para obtener el listado",
                        ref: 'tgQuery',
                        tab: 3
                    })
                    this.error_grave++;
                    } 
                
                if(this.modelo.oTablaGestiones.Row_editar == true && this.modelo.oTablaGestiones.PantallaEdit == '0' ) {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para la pantalla a utilizar para editar un registro",
                        ref: 'tgQuery',
                        tab: 3
                    })
                    this.error_grave++;
                } 
                                
                break;

            case 'C':
                // CRUD
                if(this.modelo.oCRUD01.tabla == '0') {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla CRUD (Paso 2) es obligatorio indicar la tabla",
                        ref: 'cr1Tabla',
                        tab: 4
                    })
                    this.error_grave++;
                }    
                if(this.modelo.oCRUD01.Campos.length == '0') {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla CRUD (Paso 2) es obligatorio indicar los campos a editar",
                        ref: 'cr1Tabla',
                        tab: 4
                    })
                    this.error_grave++;
                } 

                break;
                
            case 'D': 
                // Carga de datos
                if(this.modelo.oCapturaDatos.Campos.length == '0') {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Informar datos es obligatorio indicar los campos",
                        ref: 'cdCampos',
                        tab: 5
                    })
                    this.error_grave++;
                } 


                break;

            case 'I':                
                // Listado
                if(this.modelo.oListado.idQuery == '0') {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Listado/Informe es obligatorio indicar la consulta",
                        ref: 'liQuery',
                        tab: 6
                    })
                    this.error_grave++;
                }
                if(this.modelo.oListado.Columnas.length == 0) {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Listado/Informe es obligatorio indicar las columnas del informe",
                        ref: 'liColumnas',
                        tab: 6
                    })
                    this.error_grave++;
                } 
                if(this.modelo.oListado.idPlantilla == '0') {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Listado/Informe es obligatorio indicar la plantilla para el documento",
                        ref: 'liPlantilla',
                        tab: 6
                    })
                    this.error_grave++;
                }

                break;

            case 'B':
                // Buscador
                if(this.modelo.oBuscador.idQuery == '0') {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Buscador es obligatorio indicar la consulta",
                        ref: 'buQuery',
                        tab: 7
                    })
                    this.error_grave++;
                }
                if(this.modelo.oBuscador.Columnas.length == 0) {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Buscador es obligatorio indicar las columnas a incluir en el resultado",
                        ref: 'buColumnas',
                        tab: 7
                    })
                    this.error_grave++;
                } 
                if(this.modelo.oBuscador.devolverValor == '0') {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Buscador es obligatorio indicar el campo que devolverá el valor seleccionado",
                        ref: 'refbuDevolverValor',
                        tab: 7
                    })
                    this.error_grave++;
                }            
            
                break;
            
            case 'S': 
                // Selector
                if(this.modelo.oSelector.idQuery == '0') {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Selector es obligatorio indicar la consulta",
                        ref: 'seQuery',
                        tab: 8
                    })
                    this.error_grave++;
                }
                if(this.modelo.oSelector.ColumnasO.length == 0) {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Selector es obligatorio indicar las columnas a mostrar en la lista origen",
                        ref: 'seColumnasO',
                        tab: 8
                    })
                    this.error_grave++;
                }                 
                if(this.modelo.oSelector.ColumnasD.length == 0) {
                    this.errores.push({
                        idx: this.errores.length + 1,
                        codigo: 'e001',   // 'e001' Falta rellenar el campo
                        descripcion: "Para el tipo de pantalla Selector es obligatorio indicar las columnas a mostrar en la lista destino",
                        ref: 'seColumnasD',
                        tab: 8
                    })
                    this.error_grave++;
                } 
                
                break;

            }
            // *************************************************************************************** //                        
            if(this.error_grave == 0 && this.error_warning == 0) {
                this.E_expanded = false;
            }

        },
        Grabar() {

            this.Validaciones()
            .then(() => {

                // Hay errores
                if(this.error_grave > 0) {
                    funciones.popAlert('error', 'Hay errores que no permiten guardar', true, false, 8000, "Ok")
                    .then(() => {
                        return;
                    })
                } else if (this.error_warning > 0) {

                    funciones.popAlert('warning', 'Faltan datos importantes, quieres continuar?', true, true, 8000, "Sí")
                    .then((result) => {

                        if(result==true) {

                            // Con warning - Guardar
                            if(this.claveId == null) {
                                // Almacenar nuevo 
                                this.Agregar();
                            } else {    
                                // Actualizar claveId
                                this.Actualizar();
                            }

                        }
                    
                    })

                } else {

                    // Sin errores - Guardar
                    funciones.popAlert('question', 'Quieres guardar la definición de la pantalla?', true, true, 8000, "Sí")
                    .then((result) => {

                        if(result==true) {

                            if(this.claveId == null) {
                                // Almacenar nuevo documento
                                this.Agregar();
                            } else {    
                                // Actualizar el documento claveId
                                this.Actualizar();
                            }
                            
                        }
                    })

                }

            })

        },
        Agregar() {

            try{

                this.hiddentelon = false;

                let tmp = this.modelo;
                let almacenar = "";

                // Almacenar nueva definición 
                almacenar = {
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

                        funciones.popAlert("success", "Datos almacenados!", true, false, 3000, "ok")
                        .then(() => {
                            this.$router.push('/inicio');
                        })

                    } else {
                        funciones.popAlert("error", "No se ha podido grabar en este momento! (ce001)", true, false, 3000, "ok");
                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch (error) {
                console.log(error);
            }            

        },
        Actualizar() {

           try {

                let tmp = this.modelo;
                let almacenar = "";

                // Actualizar las propiedades de la pantalla
                almacenar = {
                    id:      tmp.oDatosGenerales.screenId, 
                    titulo:  tmp.oDatosGenerales.titulo, 
                    version: tmp.oDatosGenerales.version,
                    tipo:    tmp.oDisenio.tipo,
                    activa:  tmp.oDatosGenerales.activa, 
                    objeto:  JSON.stringify(this.modelo, null, '\t')
                };               
                datos.actualizarScreen("id='" + tmp.oDatosGenerales.screenId + "'", almacenar)
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        funciones.popAlert("success", "Datos actualizados!", true, false, 3000, "ok")
                        .then(() => {
                            this.$router.push('/inicio');
                        });

                    } else {
                        funciones.popAlert("error", "No se ha podido grabar en este momento! (ce001)", true, false, 3000, "ok");
                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch (error) {
                console.log(error);
            }

        },
        CargaConsulta(pId) {

            this.hiddentelon = false;   

            try {

                datos.leerLista('sys_modelo_datos', "id='" + pId + "'", ['objeto'], '')
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        let tmp_modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                        if(this.modelo.oDisenio.tipo == 'G') {
                            this.tgCadenaSQL = tmp_modelo.oQuery.cadenaSQL;
                        }
                        if(this.modelo.oDisenio.tipo == 'I') {
                            this.liCadenaSQL = tmp_modelo.oQuery.cadenaSQL;
                        }  
                        if(this.modelo.oDisenio.tipo == 'B') {
                            this.buCadenaSQL = tmp_modelo.oQuery.cadenaSQL;
                        }   
                        if(this.modelo.oDisenio.tipo == 'S') {
                            this.seCadenaSQL = tmp_modelo.oQuery.cadenaSQL;
                        }                                                                        
                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })
                
            } catch(error) {
                console.log(error);
            }

        },
        cargaCamposConsulta(pId) {

            this.aCampos = [{
                id: '0',
                descripcion: 'Selecciona un campo ...'
            }];

            if(pId == '0') {
                return;
            }

            this.hiddentelon = false;   

            try {

                let xQ = this.aQuerys.findIndex(x => x.id === pId);
                let tmp_CadenaSQL = this.aQuerys[xQ].cadenaSQL;

                this.aFiltros = this.aQuerys[xQ].filtros;

                funciones.parseSQL(tmp_CadenaSQL)
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {
                        let c = 1;
                        for(let x=0; x < result.data.SELECT.length; x++) {
                            if(result.data.SELECT[x].base_expr != '*') {
                                this.aCampos.push({
                                    id: c,
                                    descripcion: result.data.SELECT[x].base_expr
                                })
                                c++;
                            }
                        }

                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })
                
            } catch(error) {
                console.log(error);
            }


        },
        cargaCamposTabla(pId) {

            let idt = this.aTablas.findIndex(x => x.id === pId);

            for(let c = 0; c < this.aTablas[idt].campos.length; c++) {

                this.cr1Campos.push({
                    id:          this.aTablas[idt].campos[c].id,
                    descripcion: this.aTablas[idt].campos[c].descripcion,
                    tipo:        this.aTablas[idt].campos[c].tipo,
                    ancho:       this.aTablas[idt].campos[c].ancho,
                    decimales:   this.aTablas[idt].campos[c].decimales,
                    etiqueta:    this.aTablas[idt].campos[c].etiqueta,
                    default:     this.aTablas[idt].campos[c].default
                })

            }

        },     
        // TABLA DE GESTIONES        
        tgVaciarColumnas() {

            if(this.modelo.oTablaGestiones.Columnas.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de las columnas!', false, true, 3000, 'Ok')
                .then(() => {

                    this.modelo.oTablaGestiones.Columnas = [];
                    return true;

                });
            } else {
                return true;
            }

        },            
        tgDescartar() {
            this.tg_id = funciones.generarUUID2();
            this.tgTituloColumna = '';
            this.tgCampoColumna = '';
            this.tgOrdenarColumna = false;
            this.tgFiltrarColumna = false,
            
            this.tgMensaje = "";
            this.$refs.reftgTituloColumna.focus();

        },
        tgAgregar() {

            let editando = this.modelo.oTablaGestiones.Columnas.findIndex(x => x.id === this.tg_id);

            if(this.tgTituloColumna == '' || this.tgCampoColumna == '') {
                this.tgMensaje = "Faltan datos";
                this.$refs.refTituloColumna.focus();
                return;
            }

            if(editando == -1) {
                this.modelo.oTablaGestiones.Columnas.push({
                    id: this.tg_id,
                    titulo: this.tgTituloColumna,
                    campo: this.tgCampoColumna,
                    ordenar: this.tgOrdenarColumna,
                    filtrar: this.tgFiltrarColumna

                })
            } else {
                this.modelo.oTablaGestiones.Columnas[editando].titulo = this.tgTituloColumna;
                this.modelo.oTablaGestiones.Columnas[editando].campo = this.tgCampoColumna;
                this.modelo.oTablaGestiones.Columnas[editando].ordenar = this.tgOrdenarColumna;
                this.modelo.oTablaGestiones.Columnas[editando].filtrar = this.tgFiltrarColumna;
            }

            this.tgDescartar();

        },
        tgQuitar(pId) {

            this.modelo.oTablaGestiones.Columnas = this.modelo.oTablaGestiones.Columnas.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        tgEditar(pId) {

            let idx = this.modelo.oTablaGestiones.Columnas.findIndex(x => x.id === pId);

            this.tg_expanded = true;

            this.tg_id = pId;
            this.tgTituloColumna = this.modelo.oTablaGestiones.Columnas[idx].titulo;
            this.tgCampoColumna = this.modelo.oTablaGestiones.Columnas[idx].campo;
            this.tgOrdenarColumna = this.modelo.oTablaGestiones.Columnas[idx].ordenar;
            this.tgFiltrarColumna = this.modelo.oTablaGestiones.Columnas[idx].filtrar;

        },
        tgCambioQuery() {

            if(this.modelo.oTablaGestiones.Columnas.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de las columnas!', true, true, 3000, 'Continuar?')
                .then((result) => {
                    if(result == true) {
                        this.modelo.oTablaGestiones.Columnas = [];
                        this.tgCadenaSQL='';
                        this.tgidQueryOld = this.modelo.oTablaGestiones.idQuery;
                        this.cargaCamposConsulta(this.modelo.oTablaGestiones.idQuery);
                        return true;
                    } else {
                        this.modelo.oTablaGestiones.idQuery = this.tgidQueryOld;
                        return false;
                    }
                });
            } else {
                this.modelo.oTablaGestiones.Columnas = [];
                this.tgCadenaSQL='';
                this.tgidQueryOld = this.modelo.oTablaGestiones.idQuery;
                this.cargaCamposConsulta(this.modelo.oTablaGestiones.idQuery);
                return true;
            }

        },     
        // CRUD
        cr1VaciarCampos() {

            if(this.modelo.oCRUD01.Campos.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de los campos!', false, true, 3000, 'Ok')
                .then(() => {

                    this.modelo.oCRUD01.Campos = [];
                    return true;

                });
            } else {
                return true;
            }

        }, 
        cr1Descartar() {
            this.cr1_id = funciones.generarUUID2();
            this.cr1Campo = '0';
            this.cr1Etiqueta = '';
            this.cr1Formato = '0',
            this.cr1ValorDefault = '';
            this.cr1EnabledInicial = true;
            this.cr1Listaval = '0';
            this.cr1Selectable = '0';
            
            this.cr1Mensaje = "";
            this.$refs.refcr1Campo.focus();

        },
        cr1Agregar() {

            let editando = this.modelo.oCRUD01.Campos.findIndex(x => x.id === this.cr1_id);

            if(this.cr1Campo == '0' || this.cr1Etiqueta == '' || this.cr1Formato == '0' || (this.cr1Formato == 'L' && this.cr1Listaval == '0') || (this.cr1Formato == 'S' && this.cr1Selectable == '0')) {
                this.cr1Mensaje = "Faltan datos";
                this.$refs.refcr1Campo.focus();
                return;
            }

            let xcampo = this.cr1Campos.findIndex(x => x.id === this.cr1Campo);

            if(editando == -1) {
                this.modelo.oCRUD01.Campos.push({
                    id:             this.cr1_id,
                    campo:          this.cr1Campos[xcampo].descripcion,
                    etiqueta:       this.cr1Etiqueta,
                    formato:        this.cr1Formato,
                    valordefault:   this.cr1ValorDefault,
                    enabledinicial: this.cr1EnabledInicial,
                    ancho:          this.cr1Campos[xcampo].ancho,
                    decimales:      this.cr1Campos[xcampo].decimales,
                    listaval:       this.cr1Listaval,
                    selectable:     this.cr1Selectable
                })
            } else {
                this.modelo.oCRUD01.Campos[editando].campo          = this.cr1Campos[xcampo].descripcion;
                this.modelo.oCRUD01.Campos[editando].etiqueta       = this.cr1Etiqueta;
                this.modelo.oCRUD01.Campos[editando].formato        = this.cr1Formato;
                this.modelo.oCRUD01.Campos[editando].valordefault   = this.cr1ValorDefault;
                this.modelo.oCRUD01.Campos[editando].enabledinicial = this.cr1EnabledInicial;
                this.modelo.oCRUD01.Campos[editando].ancho          = this.cr1Campos[xcampo].ancho;
                this.modelo.oCRUD01.Campos[editando].decimales      = this.cr1Campos[xcampo].decimales;
                this.modelo.oCRUD01.Campos[editando].listaval       = this.cr1Listaval;
                this.modelo.oCRUD01.Campos[editando].selectable     = this.cr1Selectable;
            }

            this.cr1Descartar();

        },
        cr1Quitar(pId) {

            this.modelo.oCRUD01.Campos = this.modelo.oCRUD01.Campos.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        cr1Editar(pId) {

            let idx = this.modelo.oCRUD01.Campos.findIndex(x => x.id === pId);
            let cdx = this.cr1Campos.findIndex(x => x.descripcion === this.modelo.oCRUD01.Campos[idx].campo)

            this.cr1_expanded = true;

            this.cr1_id            = pId;
            this.cr1Campo          = this.cr1Campos[cdx].id;
            this.cr1Etiqueta       = this.modelo.oCRUD01.Campos[idx].etiqueta;
            this.cr1Formato        = this.modelo.oCRUD01.Campos[idx].formato;
            this.cr1ValorDefault   = this.modelo.oCRUD01.Campos[idx].valordefault;
            this.cr1EnabledInicial = this.modelo.oCRUD01.Campos[idx].enabledinicial;
            this.cr1Listaval       = this.modelo.oCRUD01.Campos[idx].listaval;
            this.cr1Selectable     = this.modelo.oCRUD01.Campos[idx].selectable;

            if(this.cr1Formato == 'L') {
                this.cr1CambiaListaVal();
            }

        },        
        cr1CambiaCampo() {
            this.cr1ValorDefault = '';
            let xcampo = this.cr1Campos.findIndex(x => x.id === this.cr1Campo);
            this.cr1Formato = this.cr1Campos[xcampo].tipo;
            this.cr1ValorDefault = this.cr1Campos[xcampo].default;
            this.cr1Etiqueta = this.cr1Campos[xcampo].etiqueta;

        },
        cr1CambiaListaVal() {

            this.cr1ListaValValores = [{
                id: '0',
                descripcion: 'Selecciona un valor ...',
                valor: '0'
            }];

            this.cr1ValorDefault = '0';

            let idt = this.aListasVal.findIndex(x => x.id === this.cr1Listaval);

            for(let c = 0; c < this.aListasVal[idt].valores.length; c++) {

                this.cr1ListaValValores.push({
                    id:          this.aListasVal[idt].valores[c].id,
                    descripcion: this.aListasVal[idt].valores[c].descripcion,
                    valor:       this.aListasVal[idt].valores[c].valor
                })

            }
        },
        // Carga datos
        cdCambiaAncho() {
            if(this.cdFormato != 'F') {
                this.cdValorDefault = '';
            } else {
                let tmp = this.cdValorDefault.substr(0, this.cdValorDefault.indexOf('*')); 
                console.log(tmp);   
                this.cdValorDefault = tmp + '**';
            }
        },         
        cdDescartar() {
            this.cd_id = funciones.generarUUID2();
            this.cdEtiqueta = '';
            this.cdFormato = '0',
            this.cdValorDefault = '';
            this.cdEnabledInicial = true;
            this.cdAncho = 0;
            this.cdDecimales = 0;
            this.cdListaval = '0';
            this.cdSelectable = '0';
            
            this.cdMensaje = "";
            this.$refs.refcdEtiqueta.focus();

        },
        cdAgregar() {

            let editando = this.modelo.oCapturaDatos.Campos.findIndex(x => x.id === this.cd_id);

            if(this.cdEtiqueta == '' || this.cdFormato == '0' || (this.cdFormato == 'L' && this.cdListaval == '0') || (this.cdFormato == 'S' && this.cdSelectable == '0')) {
                this.cdMensaje = "Faltan datos";
                this.$refs.refcdEtiqueta.focus();
                return;
            }

            if(editando == -1) {
                this.modelo.oCapturaDatos.Campos.push({
                    id:             this.cd_id,
                    etiqueta:       this.cdEtiqueta,
                    formato:        this.cdFormato,
                    valordefault:   this.cdValorDefault,
                    enabledinicial: this.cdEnabledInicial,
                    ancho:          this.cdAncho,
                    decimales:      this.cdDecimales,
                    listaval:       this.cdListaval,
                    selectable:     this.cdSelectable
                })
            } else {
                this.modelo.oCapturaDatos.Campos[editando].etiqueta       = this.cdEtiqueta;
                this.modelo.oCapturaDatos.Campos[editando].formato        = this.cdFormato;
                this.modelo.oCapturaDatos.Campos[editando].valordefault   = this.cdValorDefault;
                this.modelo.oCapturaDatos.Campos[editando].enabledinicial = this.cdEnabledInicial;
                this.modelo.oCapturaDatos.Campos[editando].ancho          = this.cdAncho;
                this.modelo.oCapturaDatos.Campos[editando].decimales      = this.cdDecimales;
                this.modelo.oCapturaDatos.Campos[editando].listaval       = this.cdListaval;
                this.modelo.oCapturaDatos.Campos[editando].selectable     = this.cdSelectable;
            }

            this.cdDescartar();

        },
        cdQuitar(pId) {

            this.modelo.oCapturaDatos.Campos = this.modelo.oCapturaDatos.Campos.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        cdEditar(pId) {

            let idx = this.modelo.oCapturaDatos.Campos.findIndex(x => x.id === pId);

            this.cd_expanded = true;

            this.cd_id            = pId;
            this.cdEtiqueta       = this.modelo.oCapturaDatos.Campos[idx].etiqueta;
            this.cdFormato        = this.modelo.oCapturaDatos.Campos[idx].formato;
            this.cdValorDefault   = this.modelo.oCapturaDatos.Campos[idx].valordefault;
            this.cdEnabledInicial = this.modelo.oCapturaDatos.Campos[idx].enabledinicial;
            this.cdAncho          = this.modelo.oCapturaDatos.Campos[idx].ancho;
            this.cdDecimales      = this.modelo.oCapturaDatos.Campos[idx].decimales;
            this.cdListaval       = this.modelo.oCapturaDatos.Campos[idx].listaval;
            this.cdSelectable     = this.modelo.oCapturaDatos.Campos[idx].selectable;

            if(this.cdFormato == 'L') {
                this.cdCambiaListaVal();
            }

        },        
        cdCambiaFormato() {

            let xcTipo = this.cTipos.findIndex(x => x.id ===  this.cdFormato);
            this.cdValorDefault = '';
            this.cdAncho = this.cTipos[xcTipo].anchoDefault;
            this.cdDecimales = this.cTipos[xcTipo].decimalesDefault;

        },
        cdCambiaListaVal() {

            this.cdListaValValores = [{
                id: '0',
                descripcion: 'Selecciona un valor ...',
                valor: '0'
            }];

            this.cdValorDefault = '0';

            let idt = this.aListasVal.findIndex(x => x.id === this.cdListaval);

            for(let c = 0; c < this.aListasVal[idt].valores.length; c++) {

                this.cdListaValValores.push({
                    id:          this.aListasVal[idt].valores[c].id,
                    descripcion: this.aListasVal[idt].valores[c].descripcion,
                    valor:       this.aListasVal[idt].valores[c].valor
                })

            }
        },        
        asignarTelefono(flagCodigo) {
            this.cdValorDefault = flagCodigo;
        },
        // Listados/Informes
        liDescartar() {
            this.li_id = funciones.generarUUID2();
            this.liTituloColumna = '';
            this.liCampoColumna = '0';
            
            this.liMensaje = "";
            this.$refs.refliTituloColumna.focus();
        },
        liAgregar() {

            let editando = this.modelo.oListado.Columnas.findIndex(x => x.id === this.li_id);

            if(this.liTituloColumna == '' || this.liCampoColumna == '') {
                this.liMensaje = "Faltan datos";
                this.$refs.refliTituloColumna.focus();
                return;
            }

            if(editando == -1) {
                this.modelo.oListado.Columnas.push({
                    id: this.li_id,
                    titulo: this.liTituloColumna,
                    campo: this.liCampoColumna,

                })
            } else {
                this.modelo.oListado.Columnas[editando].titulo = this.liTituloColumna;
                this.modelo.oListado.Columnas[editando].campo = this.liCampoColumna;
            }

            this.liDescartar();

        },
        liQuitar(pId) {

            this.modelo.oListado.Columnas = this.modelo.oListado.Columnas.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        liEditar(pId) {

            let idx = this.modelo.oListado.Columnas.findIndex(x => x.id === pId);

            this.li_expanded = true;

            this.li_id = pId;
            this.liTituloColumna = this.modelo.oListado.Columnas[idx].titulo;
            this.liCampoColumna = this.modelo.oListado.Columnas[idx].campo;

        },
        liCambioQuery() {

            this.liMensaje = '';

            if(this.modelo.oListado.Columnas.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de las columnas!', true, true, 3000, 'Continuar?')
                .then((result) => {
                    if(result == true) {
                        this.modelo.oListado.Columnas = [];
                        this.liCadenaSQL='';
                        this.liidQueryOld = this.modelo.oListado.idQuery;
                        this.cargaCamposConsulta(this.modelo.oListado.idQuery);
                        return true;
                    } else {
                        this.modelo.oListado.idQuery = this.liidQueryOld;
                        return false;
                    }
                });
            } else {
                this.modelo.oListado.Columnas = [];
                this.liCadenaSQL='';
                this.liidQueryOld = this.modelo.oListado.idQuery;
                this.cargaCamposConsulta(this.modelo.oListado.idQuery);
                return true;
            }

        },           
        // Buscador
        buDescartar() {
            this.bu_id = funciones.generarUUID2();
            this.buTituloColumna = '';
            this.buCampoColumna = '0';
            
            this.buMensaje = "";
            this.$refs.refbuTituloColumna.focus();
        },
        buAgregar() {

            let editando = this.modelo.oBuscador.Columnas.findIndex(x => x.id === this.bu_id);

            if(this.buTituloColumna == '' || this.buCampoColumna == '') {
                this.buMensaje = "Faltan datos";
                this.$refs.refbuTituloColumna.focus();
                return;
            }

            if(editando == -1) {
                this.modelo.oBuscador.Columnas.push({
                    id: this.bu_id,
                    titulo: this.buTituloColumna,
                    campo: this.buCampoColumna,

                })
            } else {
                this.modelo.oBuscador.Columnas[editando].titulo = this.buTituloColumna;
                this.modelo.oBuscador.Columnas[editando].campo = this.buCampoColumna;
            }

            this.buDescartar();

        },
        buQuitar(pId) {

            this.modelo.oBuscador.Columnas = this.modelo.oBuscador.Columnas.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        buEditar(pId) {

            let idx = this.modelo.oBuscador.Columnas.findIndex(x => x.id === pId);

            this.bu_expanded = true;

            this.bu_id = pId;
            this.buTituloColumna = this.modelo.oBuscador.Columnas[idx].titulo;
            this.buCampoColumna = this.modelo.oBuscador.Columnas[idx].campo;

        },
        buCambioQuery() {

            this.buMensaje = '';

            if(this.modelo.oBuscador.Columnas.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de las columnas!', true, true, 3000, 'Continuar?')
                .then((result) => {
                    if(result == true) {
                        this.modelo.oBuscador.Columnas = [];
                        this.buCadenaSQL='';
                        this.buidQueryOld = this.modelo.oBuscador.idQuery;
                        this.cargaCamposConsulta(this.modelo.oBuscador.idQuery);                
                        this.modelo.oBuscador.devolverValor = '0';

                        this.buTituloColumna = '';
                        this.buCampoColumna = '0';

                        return true;
                    } else {
                        this.modelo.oBuscador.idQuery = this.buidQueryOld;
                        return false;
                    }
                });
            } else {
                this.modelo.oBuscador.Columnas = [];
                this.buCadenaSQL='';
                this.buidQueryOld = this.modelo.oBuscador.idQuery;
                this.cargaCamposConsulta(this.modelo.oBuscador.idQuery);
                this.modelo.oBuscador.devolverValor = '0';

                this.buTituloColumna = '';
                this.buCampoColumna = '0';

                return true;
            }

        },  
        // Selector
        seDescartarO() {
            this.se_idO = funciones.generarUUID2();
            this.seTituloColumnaO = '';
            this.seCampoColumnaO = '0';
            
            this.seMensajeO = "";
            this.$refs.refseTituloColumnaO.focus();
        },
        seAgregarO() {

            let editando = this.modelo.oSelector.ColumnasO.findIndex(x => x.id === this.se_idO);

            if(this.seTituloColumnaO == '' || this.seCampoColumnaO == '') {
                this.seMensajeO = "Faltan datos";
                this.$refs.refseTituloColumnaO.focus();
                return;
            }

            let xcampo = this.aCampos[this.seCampoColumnaO].descripcion;

            if(editando == -1) {
                this.modelo.oSelector.ColumnasO.push({
                    id: this.se_idO,
                    titulo: this.seTituloColumnaO,
                    campo: this.seCampoColumnaO,
                    camponombre: xcampo

                })
            } else {
                this.modelo.oSelector.ColumnasO[editando].titulo = this.seTituloColumnaO;
                this.modelo.oSelector.ColumnasO[editando].campo = this.seCampoColumnaO;
                this.modelo.oSelector.ColumnasO[editando].camponombre = xcampo;
            }

            this.seDescartarO();

        },
        seQuitarO(pId) {

            this.modelo.oSelector.ColumnasO = this.modelo.oSelector.ColumnasO.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        seEditarO(pId) {

            let idx = this.modelo.oSelector.ColumnasO.findIndex(x => x.id === pId);

            this.se_expandedO = true;

            this.se_idO = pId;
            this.seTituloColumnaO = this.modelo.oSelector.ColumnasO[idx].titulo;
            this.seCampoColumnaO = this.modelo.oSelector.ColumnasO[idx].campo;

        },
        seDescartarD() {
            this.se_idD = funciones.generarUUID2();
            this.seTituloColumnaD = '';
            this.seCampoColumnaD = '0';
            
            this.seMensajeD = "";
            this.$refs.refseTituloColumnaD.focus();
        },
        seAgregarD() {

            let editando = this.modelo.oSelector.ColumnasD.findIndex(x => x.id === this.se_idD);

            if(this.seTituloColumnaD == '' || this.seCampoColumnaD == '') {
                this.seMensajeD = "Faltan datos";
                this.$refs.refseTituloColumnaD.focus();
                return;
            }

            let xcampo = this.aCampos[this.seCampoColumnaD].descripcion;

            if(editando == -1) {
                this.modelo.oSelector.ColumnasD.push({
                    id: this.se_idD,
                    titulo: this.seTituloColumnaD,
                    campo: this.seCampoColumnaD,
                    camponombre: xcampo

                })
            } else {
                this.modelo.oSelector.ColumnasD[editando].titulo = this.seTituloColumnaD;
                this.modelo.oSelector.ColumnasD[editando].campo = this.seCampoColumnaD;
                this.modelo.oSelector.ColumnasD[editando].camponombre = xcampo;
            }

            this.seDescartarD();

        },
        seQuitarD(pId) {

            this.modelo.oSelector.ColumnasD = this.modelo.oSelector.ColumnasD.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        seEditarD(pId) {

            let idx = this.modelo.oSelector.ColumnasD.findIndex(x => x.id === pId);

            this.se_expandedD = true;

            this.se_idD = pId;
            this.seTituloColumnaD = this.modelo.oSelector.ColumnasD[idx].titulo;
            this.seCampoColumnaD = this.modelo.oSelector.ColumnasD[idx].campo;

        },        
        seCambioQuery() {

            this.seMensajeO = '';
            this.seMensajeD = '';

            if(this.modelo.oSelector.ColumnasO.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de las columnas!', true, true, 3000, 'Continuar?')
                .then((result) => {
                    if(result == true) {
                        this.modelo.oSelector.ColumnasO = [];
                        this.modelo.oSelector.ColumnasD = [];
                        this.seCadenaSQL = '';
                        this.seidQueryOld = this.modelo.oSelector.idQuery;
                        this.cargaCamposConsulta(this.modelo.oSelector.idQuery);                

                        this.seTituloColumnaO = '';
                        this.seCampoColumnaO = '0';                        
                        this.seTituloColumnaD = '';
                        this.seCampoColumnaD = '0';

                        return true;
                    } else {
                        this.modelo.oSelector.idQuery = this.seidQueryOld;
                        return false;
                    }
                });
            } else {
                this.modelo.oSelector.ColumnasO = [];
                this.modelo.oSelector.ColumnasD = [];
                this.seCadenaSQL = '';
                this.seidQueryOld = this.modelo.oSelector.idQuery;
                this.cargaCamposConsulta(this.modelo.oSelector.idQuery);

                this.seTituloColumnaO = '';
                this.seCampoColumnaO = '0';                        
                this.seTituloColumnaD = '';
                this.seCampoColumnaD = '0';

                return true;
            }

        },  

    },
    mounted(){
        this.claveId = this.$route.params['p_claveId'];
        this.leerModelosDatos();
    },
    computed:{
        tancho:{
            get() {
                let c = this.cr1Campos.findIndex(x => x.id === this.cr1Campo);
                let retorno = this.cr1Campos[c].ancho;
                return retorno; 
            }
        },
        tdecimales:{
            get() {
                let c = this.cr1Campos.findIndex(x => x.id === this.cr1Campo);
                let retorno = this.cr1Campos[c].decimales;
                return retorno; 
            }
        },
        cr1ValorMaximoDefault:{
            get() {
                let valor = Number(Array(this.tancho + 1).join("9") + '.' + Array(this.tdecimales + 1).join("9"));
                return valor;
            }
        },
        cr1DefError:{
            get() {
                let valor = this.cr1ValorDefault.split(".").join("").split(",").join(".");
                return Number(valor) > this.cr1ValorMaximoDefault;
            }
        },
        cdValorMaximoDefault:{
            get() {
                let valor = Number(Array(Number(this.cdAncho) + 1).join("9") + '.' + Array(this.cdDecimales + 1).join("9"));
                return valor;
            }
        },
        cdDefError:{
            get() {
                let valor = this.cdValorDefault.split(".").join("").split(",").join(".");
                return Number(valor) > this.cdValorMaximoDefault;
            }
        },

    }

}

</script>
