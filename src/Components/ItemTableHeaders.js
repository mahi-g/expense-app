import React from 'react';

/**
 *
 * The explanation for ItemTable() also applies here, however implementation for it is a little bit different. Because
 * there is only ever going to be one table header, we can get away with just mapping the resultTableHeaders constant
 * established at the beginning of the file onto a lambda that transforms it into a <th>. Because this component should
 * only be rendered when list.length > 0,  if list.length < 1 then we'll instead render an empty div.
 *
 */
function ItemTableHeaders(props) {
    if(props.listCount > 0){
        const data = props.headers.map((header, index) => (
            <th key={index}>{header}</th>
        ));
        return (
            <thead>
            <tr>
                {data}
            </tr>
            </thead>
        )
    }else{
        return(<thead></thead>)
    }
}

export default ItemTableHeaders;