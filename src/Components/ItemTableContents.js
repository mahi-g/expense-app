
import React from 'react';


/**
 *
 * This function in its original form existed inside the render function of App Class, I've mode it into a function.
 * I've also changed the way it works from being a giant mess of lines that call the expense object keys one by one to
 * a cleaner solution that loops through each key of the expense object and creates an array of <td>. Once the table
 * data is created, it's put it into a <tr> wrapper and returned as the result of the Arrays.map() lambda being called.
 * This is done for every entry in props.list, and the end result is a collection of table rows which is wrapped in
 * a <tbody> and returned as the result of the function.
 *
 * As a prerequisite to this change, I've had to reorder the way you add the object keys to a given entry in the state
 * variable list. This should not affect anything else.
 *
 */
function ItemTableContents(props) {
    const rows = props.list.map((expense, index) => {
        let tableData = [];
        for (const [key, value] of Object.entries(expense)) {
            tableData.push(
                <td>{value}</td>
            )
        }
        return (
            <tr key={index}>
                {tableData}
            </tr>
        )
    });
    return (
        <tbody>
            {rows}
        </tbody>
    )
}


export default ItemTableContents;