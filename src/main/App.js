import React, { Component } from 'react';
import Graph from 'react-graph-vis';

import Menu from '../components/menu';
import FormModal from '../components/modal';

const graph = {
  nodes: [
    { id: 1, label: "Node 1", color: "#e04141" },
    { id: 2, label: "Node 2", color: "#41e041" },
    { id: 3, label: "Node 3", color: "#4141e0" },
   
  ],
  edges: [{from:1, to:2}, {from:2, to:3}]
};

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000"
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
      modal: false
    }

    this.incluir = this.incluir.bind(this);
    this.getNetwork = this.getNetwork.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.toggle = this.toggle.bind(this);
    this.openNodeForm = this.openNodeForm.bind(this);
  }

  getEvents() {
    return {
      click: () =>{
         this.hideMenu();
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
      }
    }
  }

  getNetwork(network){
    this.setState({network})
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
    let itens = [{
      text:'Adicionar novo nó',
      icon:'fa-plus',
      action:this.openNodeForm
    }]
    
    if(element === 'node'){
      itens.push({
        text: 'Editar nó selecionado',
        icon: 'fa-edit',
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
        id:id
      });
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
    
    point_to.forEach(element => {
      edges.push({from: id, to:parseInt(element, 10)})
    });

    pointed_by.forEach(element => {
      edges.push({from: parseInt(element, 10), to:id})
    });


    return edges;
  }

  getMaxId () {
    return this.state.graph.nodes.sort((a,b) => b.id - a.id)[0].id + 1;    
  }

  removeNode(id){
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

    this.hideMenu();

  }

  openNodeForm(){
    this.toggle();
    this.hideMenu();
  }

  incluir (e) {
    e.preventDefault();
    const values = this.getFormValues(e.target);
    const {label, color, point_to, pointed_by} = values;
    const id    = this.getMaxId();
    const nodes = [...this.state.graph.nodes];
    const edges = this.getNewEdges(id,point_to, pointed_by); 
    
    nodes.push({id,label,color});

    
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

  toggle(){
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>
      <FormModal toggle={this.toggle} modal={this.state.modal} nodes={this.state.graph.nodes} incluir={this.incluir}/>
        <h1>TCC do Jotinha</h1>
        
        <Menu itens={this.state.itensMenu} ></Menu>
        <Graph graph={this.state.graph} options={this.state.options} events={this.getEvents()} style={{ height: "640px" }} getNetwork={this.getNetwork} />
      </div>
    );
  }
}

export default App;
