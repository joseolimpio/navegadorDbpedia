import React, { Component} from 'react';

class Menu extends Component {
    render() {
        let {itens} = this.props;
        return (
            <div id="menu">

                {itens.map((item,index) => (
                    <a key={index} onClick={()=> item.action(item.id)}>
                      <i className={`fa ${item.icon}`}></i> {item.text}
                    </a>
                ))}
            </div>
        );
    }
}

export default Menu;