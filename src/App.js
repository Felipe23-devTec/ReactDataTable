
import './App.css';
import dados from './dados.json'
import DataTable from 'react-data-table-component';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Loading from './Loading';
function App() {
  //Documentação : https://react-data-table-component.netlify.app/?path=%2Fdocs%2Fgetting-started-intro--page
  const [toggleClearRows, setToggleClearRows] = useState(false);
  const [selectedRows,setSelectedRows] = useState([]);
  const [data, setData] =  useState([]);
  const [totalRows,setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
        name: 'Avatar',
        selector: row => <><img src={row.avatar} className='img-avatar'/>
        </>,
    },
    {
        name: 'Código',
        selector: row => row.id,
    },
    {
      name: 'Nome',
      selector: row => row.first_name + ' ' + row.last_name,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true
    },
    {
      name: 'Acao',
      cell: 
     
      (row) =>
      
      <>
          <button onClick={() => editar(row.id)}>Editar</button>
          <button onClick={() => excluir(row.id)} className='m-left'>Excluir</button>
      </>
    }
  ];
  const paginationOptions = {
    rowsPerPageText: 'Registros por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos'
  };
  function handleClearRows(){
    setToggleClearRows(!toggleClearRows);
  }
  function hendleSelectedChange(selectedRows){
    setSelectedRows(selectedRows.selectedRows)
    console.log(selectedRows.selectedRows)
  }
  function editar(id){
    alert("Editando: " + id)
  }
  function excluir(id){
    alert("Excluindo: " + id)
  }
  function ListarUsuarioLocal(){
    setData(dados);
  }
  async function ListarDadosApi(page){
    setLoading(true);
    const response = await axios.get("https://reqres.in/api/users?page="+page+"&per_page=10&delay=5");
    setData(response.data.data);
    
    setTotalRows(response.data.total);
    setLoading(false);
    console.log(totalRows)
  }
  async function ListarDadosPorPaginaApi(newQtd,page){
    setLoading(true);
    const response = await axios.get("https://reqres.in/api/users?page="+page+"&per_page="+newQtd+"&delay=5");
    setData(response.data.data);
    setLoading(false);
  }
  function handleChangePage(page){
    ListarDadosApi(page);
  }
  function handleExcluir(){

    console.log(selectedRows);
    selectedRows.map(selecao => {
      return console.log('Excluir o registro ' + selecao.id);
    });
  }
  function rowDisabled(row){
    return row.id === 3;
  }
  useEffect(() =>{
    ListarDadosApi(1);
  }, []);
  
  return (
    <div className="App">
      <h1>Consulta Usuários</h1>
      <button onClick={handleClearRows}>Limpar seleção</button>
      <button onClick={handleExcluir}>Excluir</button>
      <DataTable
        columns={columns}
        data={data}
        selectableRows={true}
        clearSelectedRows={toggleClearRows}
        pagination={true}
        paginationComponentOptions={paginationOptions}
        onSelectedRowsChange={hendleSelectedChange}
        selectableRowDisabled={rowDisabled}
        noDataComponent={"Nenhum registro encontrado"}
        onChangeRowsPerPage={ListarDadosPorPaginaApi}
        onChangePage={handleChangePage}
        paginationTotalRows={totalRows}
        paginationServer={true}
        fixedHeader={true}
        progressPending={loading}
        progressComponent={<Loading />}
      
      />
    </div>
  );
}

export default App;
