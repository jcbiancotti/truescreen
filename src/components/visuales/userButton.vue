<template>
<div class="container-fluid">

    <button class="navbar-toggler float-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="iconos material-icons md-48" style="color: white;">menu</span>
    </button>

    <div class="collapse navbar-collapse float-right" id="navbarSupportedContent">
        
        <div class="dropdown navbar-nav ml-auto float-right" v-if="isLogged">

            <span class="float-right" style="color: white;">{{fname}}</span>
            <button class="btn-link dropdown-toggle" type="button" data-toggle="dropdown" style="border:0;background-color: transparent;">
                <span class="iconos material-icons md-48">account_circle</span>
            </button>
            
            <ul class="dropdown-menu dropdown-menu-right">
                <li>
                    <router-link @click="deleteUserLogged()" to="/" class="dropdown-item">
                        Desconectar 
                        <span class="iconos inline-icon material-icons md-48">logout</span> 
                    </router-link>
                </li>
            </ul>

        </div>
        <!-- --------- -->
        <div class="btn" v-else> 

            <router-link to="/login"><span class="inline-icon material-icons md-48">account_circle</span> Acceder</router-link>

        </div>
    
    </div>

</div>
</template>

<script>

import auth from '@/utils/auth'

export default {
    name: 'userButton',
    data() {
        return {
            u: '',
            usr: {nombre_completo: ''},
        }
    },
    methods: {
        deleteUserLogged() {
            auth.deleteUserLogged();
            // Ir a Home
            this.$router.push({path: "/"});
        },

    },
    computed: {
        isLogged:{
            get() {
                return this.$store.state.logged;
            }
        },
        fname: {
            get() {
                return this.$store.state.userFullName;
            }
        }

    }
}
</script>

<style>

</style>
