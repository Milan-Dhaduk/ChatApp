import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatRoom from './ChatRoom';

function Example({id}) {

    console.log("id",id);
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example Component</div>

                        <div className="card-body">
                          <ChatRoom id={id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Example;

if (document.getElementById('app')) {
    const Index = ReactDOM.createRoot(document.getElementById("app"));
    const userIdFromElement = document.getElementById('app').getAttribute('data-user-id');
    
    Index.render(
        <>
            <Example id={userIdFromElement}/>
        </>
    )
}
