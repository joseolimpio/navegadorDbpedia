import React, { Component } from 'react';
import Graph from 'react-graph-vis';
import Menu from '../components/menu';
import FormModal from '../components/modal';
import ModalEdge from '../components/modalEdge';
import Formulario from '../components/formulario';
import axios from 'axios';
import query from '../query';



const namespaces = {
  'http://www.w3.org/2002/07/owl#': 'owl',
  'http://www.w3.org/2001/XMLSchema#': 'xsd',
  'http://www.w3.org/2000/01/rdf-schema#': 'rdfs',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#': 'rdf',
  'http://xmlns.com/foaf/0.1/': 'foaf',
  'http://purl.org/dc/elements/1.1/': 'dc',
  'http://dbpedia.org/resource/': '',
  'http://dbpedia.org/property/': 'dbpedia2',
  'http://dbpedia.org/': 'dbpedia',
  'http://www.w3.org/2004/02/skos/core#': 'skos'
};


const graph = {
  nodes: [
    //estutura do node, ID, nome e cor
 
  ],

  edges: 
  
        [
    //Estrutura das ligações: (de > para , texto da ligação e o alinhamento do mesmo)
       
        ] 
};

const options = {
  layout: {
    randomSeed: undefined,
    improvedLayout:true,
    hierarchical: {
      enabled:false,
      levelSeparation: 150,
      nodeSpacing: 100,
      treeSpacing: 200,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'UD',        // UD, DU, LR, RL
      sortMethod: 'hubsize'   // hubsize, directed
    }
  },
  edges: {
    color: "#000000",
    "smooth": {
      "type": "dynamic",
      "roundness": 0.2
    }
  },
  locale:'pt-br',
  groups:{},
  "physics": {
    "barnesHut": {
      "gravitationalConstant": -27050,
      "centralGravity": 0,
      "springConstant": 0.055
    },
    "maxVelocity": 52,
    "minVelocity": 0.26,
    "timestep": 0.73
  }
};


class App extends Component {
 
  constructor(){
    super();

    this.state={
      graph,
      options,
      network : {},
      menu : {},
      itensMenu: [],
      modal: false,
      modalEdge: false,
      editingNode:{
        id:'',
        label:'',
        color:'',
        point_to:[0],
        pointed_by:[0]
      },
      editingEdge:{
        id:'',
        label:'',
        align:'',
      }
    }

    this.salvar = this.salvar.bind(this);
    this.salvarEdge = this.salvarEdge.bind(this);
    this.getNetwork = this.getNetwork.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleEdge = this.toggleEdge.bind(this);
    this.openNodeForm = this.openNodeForm.bind(this);
    this.editar = this.editar.bind(this);
    this.editarEdge = this.editarEdge.bind(this);
    this.carregar = this.carregar.bind(this);
    this.resetar = this.resetar.bind(this);
  }

  resetar(){
    let nodes = [];
    let edges = [];


    this.setState({
      graph:{
        edges, nodes
      }
    })  
  }

  getEvents() {
    return {
      click: (e) =>{
      },

      oncontext: (event) =>{
        let {network} = this.state;
        let node = network.getNodeAt(event.pointer.DOM);
        let edge = network.getEdgeAt(event.pointer.DOM);
        let itensMenu = [];
       
        event.event.preventDefault();

        if(node !== undefined){
          itensMenu = this.getItensMenu('node', node);
        }else if(edge !== undefined){
          itensMenu = this.getItensMenu('edge', edge);
        }else{
          itensMenu = this.getItensMenu('');
        }

        this.setState({
          itensMenu
        });

        this.showMenu(event.event.x, event.event.y)
        return false;
      },
      doubleClick:(e) => {
    
        if(e.nodes.length !== 0){
          const nodes = [...this.state.graph.nodes];
          let node = {};
          this.hideMenu();
      
          nodes.forEach(item => {
            if(item.id === e.nodes[0]){
              node = {...item};
            }
          });
          
          this.getNodes(node.value, node.label);
        }else{
          this.agruparEdges(e.edges[0]);
        }
      },
      selectNode:(params)=>{
        let {network} = this.state;
        if (params.nodes.length === 1) {

          if (network.isCluster(params.nodes[0]) === true) {
              network.openCluster(params.nodes[0]);
          }
        } 
      }
    }
  }

  getNetwork(network){
    this.setState({network})
  }

  limpar(){
    let state = {...this.state};
    state.editingNode = {
      id:'',
      label:'',
      color:'',
      point_to:[0],
      pointed_by:[0]
    }
    
    state.editingEdge = {
      id:'',
      label:'',
      align:'',
    }

    this.setState(state)    
  }

  showMenu(x,y){
    let {menu} = this.state;

    menu.top        = y + "px";
    menu.left       = x + "px";
    menu.visibility = "visible";
    menu.opacity    = "1";
  }
  
  hideMenu(){
    let {menu} = this.state;
    menu.opacity = "0";
    setTimeout(function() {
      menu.visibility = "hidden";
    }, 501);
  
  }

  getItensMenu(element, id = null){
    let itens = [];
    
    if(element === 'node'){
      itens.push({
        text: 'Editar nó selecionado',
        icon: 'fa-edit',
        action: this.editar,
        id: id
      });
      itens.push({
        text: 'Excluir o nó selecionado',
        icon: 'fa-trash',
        id:id,
        action: this.removeNode
      });
    }else if(element === 'edge'){
      itens.push({
        text: 'Editar label do ponteiro',
        icon: 'fa-pen',
        action:this.editarEdge,
        id:id
      });
    }else{
      itens = [{
        text:'Adicionar novo nó',
        icon:'fa-plus',
        action:this.openNodeForm
      }]
    }

    return itens;
  }

  getSelectValues(field){
    return Array.prototype.map.apply(
      field.selectedOptions, 
      [function (option) {
        return option.value
      }]
    )
  }

  getFormValues (form) {
    return Object.values(form).reduce((obj,field) => { 
      if(field.type !== 'submit' && field.type !== undefined){
        obj[field.name] = field.type ==='select' || field.type === 'select-multiple' ? this.getSelectValues(field) :field.value; 
        return obj 
      }else{
        return obj
      }
    }, {})
  }

  getNewEdges (id, point_to, pointed_by ){
    const edges = [...this.state.graph.edges];
    let label = '<<Ligação>>';
    let font = {align: 'bottom'}
    
    point_to.forEach(element => {
      edges.push({from: id, to:parseInt(element, 10), label,font})
    });

    pointed_by.forEach(element => {
      edges.push({from: parseInt(element, 10), to:id, label, font})
    });


    return edges;
  }

  getMaxId () {
    let nodes = [...this.state.graph.nodes];
    
    return nodes.length > 0 ? nodes.sort((a,b) => b.id - a.id)[0].id + 1 : 1;    
  }

  removeNode(id){
    if(id){
      const edges = [...this.state.graph.edges];
      const nodes = [...this.state.graph.nodes];
      const newNodes = [];
      const newEdges = [];

      nodes.forEach((node)=>{
        if(node.id !== parseInt(id, 10)){
          newNodes.push(node);
        }
      })

      edges.forEach((edge)=>{
        if(edge.to !== parseInt(id,10) && edge.from !== parseInt(id,10)){
          newEdges.push(edge);
        }
      })

      this.setState({
        graph:{
          nodes:newNodes, edges:newEdges
        }
      })
    }
    this.hideMenu();

  }

  openNodeForm(){
    this.limpar();
    this.toggle();
    this.hideMenu();
  }

  editar(id){
    let nodes = [...this.state.graph.nodes];
    let edges = [...this.state.graph.edges];
    let node = {};
    
    nodes.forEach(item => {
      if(item.id === id){
        node = {...item};
      }
    });

    node.pointed_by = [];
    node.point_to = [];

    edges.forEach( item => {
      if(item.to === id){
        node.pointed_by.push(item.from)
      }
      if(item.from === id){
        node.point_to.push(item.to)
      }
    })

    this.setState({
      editingNode : node
    })

    this.toggle();
    this.hideMenu();
  }
  
  editarEdge(id){
    let edges = [...this.state.graph.edges];
    let edge = {};
    
    edges.forEach(item => {
      if(item.id === id){
        edge = {...item};
      }
    });
    
    this.setState({
      editingEdge : {
        id,
        label:edge.label,
        align:edge.font.align,
      }
    })

    this.toggleEdge();
    this.hideMenu();

  }

  agruparEdges(id){
    let {network} = this.state;
    let edges = [...this.state.graph.edges];
    let edge = {};
    let count = 0;

    edges.forEach(item => {
      if(item.id === id){
        edge = {...item};
      }
    });

    edges.forEach( item => {
      if (item.label === edge.label && item.to === edge.to && item.id !== edge.id){
        count++;
      }
    })

    let clusterOptionsByData = {
      joinCondition: (nodeOptions) =>{
        let atende = false;
        
        edges.forEach(item2 => {
          if(item2.from === nodeOptions.id && item2.label === edge.label){
            atende = true;
          }
        })

        return atende;
      },
      processProperties: function(clusterOptions, childNodes) {
        clusterOptions.label = "[" + childNodes.length + "]";
        console.log(this.clusterOptions)
        return clusterOptions;
      },
      clusterNodeProperties: {borderWidth:3, shape:'dot', mass:1, font:{size: 30}, size:(edges.length * (count/10)) + 15},
      clusterEdgeProperties: {label:edge.label}
    };

    network.cluster(clusterOptionsByData);
    network.redraw();

  }

  salvarEdge(e){
    e.preventDefault();
    const values = this.getFormValues(e.target);
    let edges = [...this.state.graph.edges];
    let nodes = [...this.state.graph.nodes];

    edges = edges.map(item => {
      let item_retorno = {...item};
        if(item_retorno.id === values.id){
          item_retorno.label = values.label;
          item_retorno.font.align = values.align;
        } 

        item_retorno.from = item.from;
        item_retorno.to = item.to;

        return item_retorno;
    })


    this.setState({
      graph:{
        edges, nodes
      }
    })
    e.target.reset();
    this.toggleEdge();

  }

  salvar (e) {
    e.preventDefault();
    const values = this.getFormValues(e.target);
    const {label, color, point_to, pointed_by} = values;
    const id    = values.id ? parseInt(values.id, 10) : this.getMaxId();
    let nodes = [...this.state.graph.nodes];
    const edges = this.getNewEdges(id,point_to, pointed_by); 
    
    if(values.id){
      nodes = nodes.map(item => {
        let item_retorno = {...item};
          if(item_retorno.id === parseInt(values.id, 10)){
            item_retorno.label = label;
            item_retorno.color = color;
          } 
          return item_retorno;
      })
    }else{
      nodes.push({id,label,color});
    }
    
    this.setState({
      graph:{
        nodes, edges
      }
    })
    e.target.reset();
    this.toggle();
  }

  componentDidMount(){
    let menuStyle = document.getElementById("menu").style;    

    this.setState({
      menu:menuStyle
    })
  }

  compoentDidUpdate(){
  }

  toggle(){
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleEdge(){
    this.setState({
      modalEdge: !this.state.modalEdge
    });
  }

  pegarNodeNome(text){
    let texto = text.substr(text.lastIndexOf('/') + 1);
    texto = texto.substr(texto.lastIndexOf('#') + 1);
    return texto;
  }


 getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  buscarNode(nodes, nome){
    return nodes.find((item)=>{
      return item.label === nome;
    })
  }


  criarObjetos(data, inicial){
    let nomePredicado = '';
    let nomeObjeto    = '';
    let nomeSujeito   = '';
    let predicado     = {};
    let sujeito       = {};
    let maxId         = this.getMaxId();
    let nodes         = [...this.state.graph.nodes];
    let edges         = [...this.state.graph.edges];
    let options        = {...this.state.options};
    let bindings      = data.results.bindings;
    let cor           = this.getRandomColor();
    let value         = '';
    let {network}     = this.state;
    let objetos       = [];
    let objetosCluster= [];


    nomeSujeito = this.pegarNodeNome(inicial).substr(0,40);
    options.groups[nomeSujeito] = {color:{background:cor}, borderWidth:3};
    
    sujeito = this.buscarNode(nodes, nomeSujeito);
    if(!sujeito){
      sujeito =  {id:maxId, label:nomeSujeito,  value:inicial, group:nomeSujeito, mass:3};
      nodes.push(sujeito);
      maxId = maxId + 1;
    }else{
      nodes.map(item =>{
        if(item.id === sujeito.id){
          item.group = nomeSujeito;
        }
        return item;
      })
    }
    
    bindings.forEach(item => {
      nomePredicado = this.pegarNodeNome(item.value.value.toString()).substr(0,40);
      nomeObjeto    = this.pegarNodeNome(item.property.value.toString());
      objetos.push(nomeObjeto);
      predicado = this.buscarNode(nodes, nomePredicado);
      if(!predicado){
        value = item.value.type === 'uri' ? item.value.value : 'http://dbpedia.org/resource/' + item.value.value;
        predicado = {id:maxId, label:nomePredicado,value: value, group:nomeSujeito, mass:3} ;
        nodes.push(predicado);
        maxId = maxId + 1;
      }

      edges.push({
        from: predicado.id, to:sujeito.id, label:nomeObjeto, font:{align: 'middle'}
      })

    });

    objetos.forEach(item => {
      let count = 0;
      objetos.forEach(item2 => {
        if(item === item2){
          count++;
        }
      })

      if(count >= 2){
        objetosCluster[item] = count;
      }

    }) 
    

    this.setState({
      graph:{
        nodes, edges
      },
      options 
    }, () => {
      for(let elem in objetosCluster){
        let clusterOptionsByData = {
          joinCondition: (nodeOptions) =>{
            let atende = false;
            
            edges.forEach(item2 => {
              if(item2.from === nodeOptions.id && item2.label === elem){
                atende = true;
              }
            })

            return atende;
          },
          processProperties: function(clusterOptions, childNodes) {
            clusterOptions.label = "[" + childNodes.length + "]";
            return clusterOptions;
          },
          clusterNodeProperties: {borderWidth:3, shape:'dot', mass:1, font:{size: 30}, size:(edges.length * (objetosCluster[elem]/10)) + 15}
        };
        network.cluster(clusterOptionsByData);
        network.redraw();
      }
      
    })
  }

  toPrefixes(namespaces) {
    var result = '';
    for (var uri in namespaces) {
        result += 'PREFIX ' + namespaces[uri] + ': <' + uri + '>\n';
    }
    return result;
  } 

  carregar(e){
    e.preventDefault()
    let values = this.getFormValues(e.target);
    this.getNodes('http://dbpedia.org/resource/' + values.sujeito, values.sujeito);
    
  }

  getNodes(resource, sujeito){

    let app = this;
    axios.get('http://dbpedia.org/sparql', {
      params: {
        'default-graph-uri': 'http://dbpedia.org',
        query: this.toPrefixes(namespaces) + query.replace('[+++RESOURCE+++]', resource),
        format: 'application/sparql-results+json'
      }
    })
    .then(function (response) {
      app.criarObjetos(response.data, sujeito)
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  render() {
    return (
      <div>
      <FormModal toggle={this.toggle} modal={this.state.modal} nodes={this.state.graph.nodes} salvar={this.salvar} editingNode={this.state.editingNode}/>
      <ModalEdge toggle={this.toggleEdge} modal={this.state.modalEdge} nodes={this.state.graph.nodes} salvar={this.salvarEdge} editingEdge={this.state.editingEdge}/>
        <h1>Navegador de recursos Dbpedia</h1>
        
        <Menu itens={this.state.itensMenu} ></Menu>
        <Formulario carregar={this.carregar} resetar={this.resetar}/>
        <Graph graph={this.state.graph} options={this.state.options} events={this.getEvents()} style={{ height: "900px" }} getNetwork={this.getNetwork} />
      </div>
    );
  }
}

export default App;
