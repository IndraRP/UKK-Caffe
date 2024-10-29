import React from 'react';
import {Routes, Route}from "react-router-dom"

import './index.css';

//USER
// import Home from "./page/home"
import Login from "./page/login"
import Regis from "./page/register"

//ADMIN
import HomeAdmin from "./admin/homeadmin"
import Create from "./admin/createmenu"
import Tablemenu from "./admin/tablesmenu"
import CreateMeja from "./admin/createmeja"
import CreateUser from "./admin/createuser"
import TableUser from "./admin/tablesuser"

import Meja from "./admin/tablesmeja"

//Kasir
import HomeKasir from "./kasir/homekasir"
import Transaksikasir from "./kasir/data_transaksi_kasir"

//MANAJER
import HomeManajer from "./manajer/homemanager"
import DataTransaksi from "./manajer/datatransaksi_manajer"

//COMPONENTS
import Footer from "./component/footer"

function App() {
  return (
    <div>

    <Routes>
    <Route path="/" Component={Login} />
    <Route path="/Regis" Component={Regis} />

    <Route path="/admin" Component={HomeAdmin} />
    <Route path="/admin/menu/create" Component={Create} />
    <Route path="/admin/menu/table" Component={Tablemenu} />
    <Route path="/admin/meja/create" Component={CreateMeja} />
    <Route path="/admin/user/table" Component={TableUser} />
    <Route path="/admin/user/create" Component={CreateUser} />
    
    <Route path="/admin/meja/table" Component={Meja} />

    <Route path="/kasir" Component={HomeKasir} />
    <Route path="/transaksikasir" Component={Transaksikasir} />

    <Route path="/manajer" Component={HomeManajer} />
    <Route path="/transaksimanajer" Component={DataTransaksi} />

    </Routes>
<Footer/>
    </div>
  );
}
export default App
