import { sc } from 'graphql-compose'

import { DataSourceEnumTC, MoneyTC } from './Common.js'

const SelectionTypeEnumTC = sc.createEnumTC({
  name: 'SelectionTypeEnum',
  description: '',
  values: {
    SINGLE: { value: 'SINGLE' },
    MULTIPLE: { value: 'MULTIPLE' }
  }
})

const ProductInterfaceTC = sc.createInterfaceTC({
  name: 'Product',
  description: 'The base product interface for the common data model',
  fields: {
    name: {
      type: 'String!',
      description: "The vendor's name for the product"
    },
    description: {
      type: 'String',
      description: "The vendor's description of the product"
    },
    dataSource: {
      type: DataSourceEnumTC.getTypeNonNull().getType(),
      description:
        'The data source for this product. Must be one of SQUARE, SHOPIFY, or EXCEL'
    },
    merchant: {
      type: 'String!',
      description:
        'Must be a merchant supported by Hedwig; check the list before using this field.'
    }, // TODO: Add merchant data type
    image: {
      type: 'String',
      description:
        'An image associated with a product, may or may not be present.'
    }
  }
})

const ItemVariantTC = sc
  .createObjectTC({
    name: 'ItemVariant',
    description: 'A variant of an existing Item',
    fields: {
      dataSourceId: {
        type: 'String!',
        description:
          'The ID of the item variant in the data source. Up to developer to verify correctness.'
      },
      parentItemId: {
        type: 'String!',
        description:
          'The ID of the item of which this is a variant. May not be applicable for all data sources.'
      },
      price: {
        type: MoneyTC.getTypeNonNull().getType(),
        description: 'The base price of this variant.'
      }
    }
  })
  .addInterfaces([ProductInterfaceTC])
  .merge(ProductInterfaceTC)

const ItemModifierTC = sc
  .createObjectTC({
    name: 'ItemModifier',
    description: 'A modifier for Items',
    fields: {
      dataSourceId: {
        type: 'String!',
        description:
          'The ID of the item modifier in the data source. Up to developer to verify correctness.'
      },
      parentListId: {
        type: 'String!',
        description:
          'The ID of the modifier list containing this modifier in the data source. Up to the developer to verify correctness.'
      },
      price: {
        type: MoneyTC.getTypeNonNull().getType(),
        description: 'The base price of this variant.'
      }
    }
  })
  .addInterfaces([ProductInterfaceTC])
  .merge(ProductInterfaceTC)

const ItemModifierListTC = sc.createObjectTC({
  name: 'ItemModifierList',
  description: 'A modifier list containing modifiers that apply to Items',
  fields: {
    dataSourceId: {
      type: 'String!',
      description:
        'The ID of the modifier list in the data source. Up to developer to verify correctness.'
    },
    name: {
      type: 'String!',
      description: 'The name of the modifier list in the data source.'
    },
    selectionType: {
      type: SelectionTypeEnumTC.getType(),
      description:
        'Can either be SINGLE or MULTIPLE; if SINGLE, only one modifier can be selected. If MULTIPLE, more than one can be selected.'
    },
    modifiers: {
      type: ItemModifierTC.getTypePlural().getType(),
      description: 'The modifiers that are included in this modifier list.'
    },
    minModifiers: {
      type: 'Int',
      description: 'The minimum number of modifiers needed to be selected'
    },
    maxModifiers: {
      type: 'Int',
      description: 'The maximum number of modifiers needed to be selected'
    }
  }
})

const ItemTC = sc
  .createObjectTC({
    name: 'Item',
    description: 'An item in the common data model',
    fields: {
      dataSourceId: {
        type: 'String!',
        description:
          'The ID of the item in the data source. Up to developer to verify correctness.'
      },
      variants: {
        type: ItemVariantTC.getTypePlural().getType(),
        description: 'A list of variants of this item'
      },
      modifierLists: {
        type: ItemModifierListTC.getTypePlural().getType(),
        description: 'A list of modifier lists that apply to this item'
      },
      category: {
        type: 'String',
        description:
          'The category of this item as defined in the data source. May or may not be present.'
      },
      isAvailable: {
        type: 'Boolean',
        description: 'Whether this item is available or not'
      }
    }
  })
  .addInterfaces([ProductInterfaceTC])
  .merge(ProductInterfaceTC)

export { ProductInterfaceTC, ItemTC }
