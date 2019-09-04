import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
const  SpinnerComponet = (props)=>{
  
  return (
    <div className="containerLoading">
        <Spinner animation="grow" size="lg" role="status">
        <span className="sr-only">Loading...</span>
        </Spinner>
  </div>
  );
}
export default SpinnerComponet;