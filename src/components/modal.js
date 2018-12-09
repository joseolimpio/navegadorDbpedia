import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';

class FormModal extends React.Component {

  render() {
    let {modal, toggle, nodes, salvar, editingNode} = this.props;
    
    return (
      <div>
        <Modal isOpen={modal} toggle={toggle}>
            <Form onSubmit={salvar}>
                <ModalHeader toggle={toggle}>Dados do nó</ModalHeader>
                <ModalBody>
                    <input type="hidden" id="id" name="id" defaultValue={editingNode.id} />
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="label">Label: </Label>
                        <Input type="text" name="label" id="label" placeholder="Nome do nó" defaultValue={editingNode.label} />
                    </FormGroup>
                    <br/>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="color">Cor: </Label><br/>
                        <input type="color" id="color" name="color" defaultValue={editingNode.color} />
                    </FormGroup>
                    <br/>
                    
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="point_to">Aponta para: </Label>
                        <Input type="select" name="point_to" id="point_to" multiple defaultValue={editingNode.point_to}>
                            <option value='0'>Nenhum</option>
                            {nodes.map((value,index)=>(
                                <option key={index} value={value.id}>{value.label}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <br/>
                    
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="pointed_by">É apontodo por: </Label>
                        <Input type="select" name="pointed_by" id="pointed_by" defaultValue={editingNode.pointed_by} multiple>
                            <option value='0'>Nenhum</option>
                            {nodes.map((value,index)=>(
                                <option key={index} value={value.id}>{value.label}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <br/>
                </ModalBody>
                <ModalFooter>
                   
                    <Button color='primary'> {!!editingNode.id ? 'Editar' : 'Adicionar'}</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                </ModalFooter>
            </Form>
        </Modal>
      </div>
    );
  }
}

export default FormModal;