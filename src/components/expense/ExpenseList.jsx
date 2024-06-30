const ExpenseList = (props) => {

    return (
        <div key={props.id} className="card shadow-lg mt-3 mb-3">
            <div className="card-body">
                <h5 className="card-title">Expense No :: {' '}{props.index + 1}</h5>
                <p><strong>Amount:</strong> ₹{props.expense.amount}</p>
                <p><strong>Description:</strong> {props.expense.description}</p>
                <p><strong>Category:</strong> {props.expense.category}</p>
                <button type="button" className="btn btn-secondary me-3" onClick={() => { props.onEdit(props.id, props.expense) }}>Edit</button>
                <button type="button" className="btn btn-dark" onClick={() => { props.onDelete(props.id) }}>Delete</button>
            </div>
        </div>
    )
}

export default ExpenseList