
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync , faArrowUp,faArrowDown } from '@fortawesome/free-solid-svg-icons'

export class PortList extends React.Component{

	state = {
		selectedPort:{
			path:undefined,
            
        },
        baudRate:9600,
        show:true,
	}


	handleClick = (port)=>{
        const {selectedPort,baudRate} = this.state
        if (selectedPort.path == port.path){
            if(this.props.onDeselect) {
                this.props.onDeselect({...port,baudRate})
            }
            this.setState({selectedPort:{
                path:undefined,
            }})
            
        }
        else{
            this.setState({selectedPort:port})
            if(this.props.onSelect) {
                this.props.onSelect({...port,baudRate})
            }
        }
		
	}
    // reconnect = ()=>{
    //         const {selectedPort,baudRate} = this.state
    //         if(this.props.onSelect) {
    //             this.props.onSelect({...selectedPort,baudRate})
    //         }
    // }
  render(){
	const {portsList} = this.props
	const {selectedPort,show} = this.state
			  return(
                <div className="accordion w-100" id="accordionExample">
                    <div className="card" >

                        <div className="card-header" id="headingOne">
                            <div className="row">
                                <button className="mr-auto btn btn-link text-left"
                                type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"
                                onClick={()=> this.setState({show:!this.state.show})}
                                >
                                     <h3 className="my-auto">Port List </h3>

                                </button>
                                {/* <input type="text" value={this.state.baudRate} onChange={this.reconnect}></input> */}
                                <button
                                    className="btn btn-link text-left"
                                    onClick={()=>{
                                        this.setState({show:true})
                                        this.props.refreshPorts()
                                    }}
                                >
                                <FontAwesomeIcon icon={faSync}/>
                                </button>
                                <button
                                    className="btn btn-link text-left"
                                    onClick={()=>{
                                        this.setState({show:!show})
                                    }}
                                >
                                <FontAwesomeIcon icon={(show)?faArrowUp : faArrowDown}/>
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className={`  list-group  overflow-auto collapse ${this.state.show? "show":""} `}  id="collapseOne" aria-labelledby="headingOne" data-parent="#accordionExample">

                        {
                            portsList
                            .map(
                                (port)=>{
                                    return (
                                
                                            <button
                                            className={` container list-group-item list-group-item-action ${(this.state.selectedPort.path === port.path)? "hover-overlay active" : ""}`}
                                            onClick={()=>this.handleClick(port)}
                                            key={port.id}
                                            >
                                                <div className="d-flex w-100 justify-content-between">
                                                    <h5 className="mb-1">{port.path}</h5>
                                                    <small>{port.id}</small>
                                                    <small>{port.vendor}</small>
                                                    <small>{port.locationId}</small>
                                                </div>
                                                <p className="mb-1">{port.serialNumber}</p>
                                                <small>{port.manufacturer}</small>
                                                <div className="overlay" />
                                            </button>

                                            
                                    );
                                }
                            )
                        }


                    </div>

                </div>
				);
			  }

}
