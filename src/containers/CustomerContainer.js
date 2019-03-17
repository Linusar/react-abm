import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppFrame from './../components/AppFrame';
import PropTypes from 'prop-types';
import { getCustomerByDni } from './../selectors/customers';
import { Route, withRouter } from 'react-router-dom';
import CustomerEdit from './../components/CustomerEdit';
import CustomerData from './../components/CustomerData';
import { fetchCustomers } from './../actions/fetchCustomers';
import { updateCustomer } from './../actions/updateCustomer';
import { SubmissionError } from 'redux-form';

class CustomerContainer extends Component {//<p>Datos del Cliente {this.props.customer.name}</p>
    
    componentDidMount() {
        if(!this.props.customer){
            this.props.fetchCustomers();
        }
    }

    handleSubmit = values => {
        console.log(JSON.stringify(values));
        const { id } = values;
        return this.props.updateCustomer(id, values).then( r => {
            if( r.error ){
                throw new SubmissionError(r.payload);
            }
        });
    }

    handleOnBack = () => {
        this.props.history.goBack();
    }

    handleOnSumitSucces = () =>{
        this.props.history.goBack();
    }

    renderBody = () => (
        <Route path="/customers/:dni/edit" children={
                ({ match }) => { 
                    const CustomerControler = match ? CustomerEdit : CustomerData;
                    return <CustomerControler {...this.props.customer} 
                    onSubmit={this.handleSubmit}
                    onSubmitSuccess={this.handleOnSumitSucces}
                    onBack={this.handleOnBack}/>
                }
            } />
    )
    render() {
        return (
            <div>
                <AppFrame 
                    header={`Cliente ${this.props.dni}`}
                    body={this.renderBody()}
                ></AppFrame>
            </div>
        );
    }
}

CustomerContainer.propTypes = {
    dni: PropTypes.string.isRequired,
    customer: PropTypes.object,
    fetchCustomers: PropTypes.func.isRequired,
    updateCustomer: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    customer: getCustomerByDni(state, props)
});

export default withRouter(connect(mapStateToProps, {
        fetchCustomers,
        updateCustomer
    })(CustomerContainer));