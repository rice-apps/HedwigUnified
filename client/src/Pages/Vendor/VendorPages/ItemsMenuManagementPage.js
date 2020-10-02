import React from 'react'
import VendorsideTemplate from './../VendorComponents/VendorGridContainer.js'
import ItemCatalog from './../VendorComponents/ItemsComponents/ItemCatalog.js'
function ItemsMenuManagementPage() {
    return (
        <VendorsideTemplate page={<ItemCatalog/>}></VendorsideTemplate>
    )
}

export default ItemsMenuManagementPage
