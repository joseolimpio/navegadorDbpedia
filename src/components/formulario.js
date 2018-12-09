import React from 'react';
import { Button, Form, InputGroupAddon, InputGroup,  Input} from 'reactstrap';




const Formulario = ({carregar, resetar}) => {
    return (
        <div>
            <Form onSubmit={carregar}>
            
            <hr/>
            <h3 className="text-muted">Por favor, insira o recurso que deseja visualizar:</h3>

             <InputGroup>
                <InputGroupAddon addonType="prepend">http://dbpedia.org/resource/</InputGroupAddon>
                    <Input placeholder="Sujeito" name='sujeito' defaultValue="Disownment"/>
                <InputGroupAddon addonType="append"><Button color="primary">Carregar</Button><Button color="secondary" onClick={resetar}>Limpar</Button></InputGroupAddon>
            </InputGroup>

            </Form>
        </div>
    );
}

export default Formulario;