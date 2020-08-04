
import React from 'react';

/**
 *
 * Originally you had this as a class. It did not need to be a class so I changed it to a function
 * You also seem to be using un-collapsed tags. An un-collapsed tag is a tag that has no inner contents between
 * its open and close statements. I have changed your un-collapsed tags to collapsed ones. Example:
 *
 * Collapsed:
 * <Component/>
 *
 * Un-Collapsed:
 * <Component></Component>
 *
 * Basically, if you aren't putting anything inside of a tag, there is no reason for it to be un-collapsed.
 *
 */
function Forms(props) {
    return (
        <div>
            <form onSubmit={props.handleFormInputs}>
                <input type="number" name="paid" placeholder="price you paid" step="0.01" min="0" required/>
                <input type="number" name="sold" placeholder="sold" step="0.01" min="0" required/>
                <input type="number" name="shipping" placeholder="shipping" step="0.01" min="0" required/>
                <input type="number" name="other" placeholder="other" step="0.01" min="0" required/>
                <input type="month" name="date" defaultValue="2020-08" required/>
                <select name="platform">
                    <option value="Etsy">Etsy</option>
                    <option value="Depop">Depop</option>
                    <option value="Ebay">Ebay</option>
                </select>
                <button>Calculate</button>
                
            </form>
        </div>
    )
}


export default Forms;