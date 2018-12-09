import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';




const Formulario = ({nodes, incluir}) => {
    return (
        <div>
            <Form onSubmit={incluir}>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="label">Label: </Label>
                    <Input type="text" name="label" id="label" placeholder="Nome do nó" />
                </FormGroup>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="color">Cor: </Label>
                    <input type="color" id="head" name="color"  />
                </FormGroup>
                
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="point_to">Aponta para: </Label>
                    <Input type="select" name="point_to" id="point_to" multiple>
                        <option value='0'>Nenhum</option>
                        {nodes.map((value,index)=>(
                            <option key={index} value={value.id}    >{value.label}</option>
                        ))}
                    </Input>
                </FormGroup>
                
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="pointed_by">É apontodo por: </Label>
                    <Input type="select" name="pointed_by" id="pointed_by" multiple>
                        <option value='0'>Nenhum</option>
                        {nodes.map((value,index)=>(
                            <option key={index} value={value.id}>{value.label}</option>
                        ))}
                    </Input>
                </FormGroup>

                <Button color='primary'>Adicionar</Button>
            </Form>
        </div>
    );
}

export default Formulario;