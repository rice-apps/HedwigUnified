// import { composeWithJson, composeInputWithJson } from "graphql-compose-json";
// import SquareConnect from "square-connect";

// const SquareProductModel = {
// 	object: {
// 		type: "ITEM",
// 		id: "LQQEVMMGM25I5L2B64Z6V2YO",
// 		updated_at: "2020-06-13T19:02:31.878Z",
// 		version: 1592074951878,
// 		is_deleted: false,
// 		present_at_all_locations: true,
// 		item_data: {
// 			name: "Thai Tea",
// 			description: "An objectively great tea.",
// 			visibility: "PRIVATE",
// 			category_id: "NPOIARPYSTXUGDTD7P7THPUJ",
// 			modifier_list_info: [
// 				{
// 					modifier_list_id: "2CTBFXQW7PH3MIKNS455SPGI",
// 					visibility: "PUBLIC",
// 					min_selected_modifiers: -1,
// 					max_selected_modifiers: -1,
// 					enabled: true,
// 				},
// 				{
// 					modifier_list_id: "DXTL353OA4Z4XDMCUXJK7QJF",
// 					visibility: "PUBLIC",
// 					min_selected_modifiers: -1,
// 					max_selected_modifiers: -1,
// 					enabled: true,
// 				},
// 				{
// 					modifier_list_id: "36Z5B4SZANHFPF7TPG6AZW75",
// 					visibility: "PUBLIC",
// 					min_selected_modifiers: -1,
// 					max_selected_modifiers: -1,
// 					enabled: true,
// 				},
// 			],
// 			variations: [
// 				{
// 					type: "ITEM_VARIATION",
// 					id: "MCYMC2QEPJG4D3U46TM4RIOS",
// 					updated_at: "2020-06-13T18:56:45.047Z",
// 					version: 1592074605047,
// 					is_deleted: false,
// 					present_at_all_locations: true,
// 					item_variation_data: {
// 						item_id: "LQQEVMMGM25I5L2B64Z6V2YO",
// 						name: "Medium",
// 						sku: "",
// 						ordinal: 1,
// 						pricing_type: "FIXED_PRICING",
// 						price_money: {
// 							amount: 350,
// 							currency: "USD",
// 						},
// 					},
// 				},
// 				{
// 					type: "ITEM_VARIATION",
// 					id: "TNI3YTS7XJJPGF4XX5J7XWIB",
// 					updated_at: "2020-06-13T18:56:45.047Z",
// 					version: 1592074605047,
// 					is_deleted: false,
// 					present_at_all_locations: true,
// 					item_variation_data: {
// 						item_id: "LQQEVMMGM25I5L2B64Z6V2YO",
// 						name: "Large",
// 						sku: "",
// 						ordinal: 2,
// 						pricing_type: "FIXED_PRICING",
// 						price_money: {
// 							amount: 400,
// 							currency: "USD",
// 						},
// 					},
// 				},
// 			],
// 			product_type: "REGULAR",
// 			skip_modifier_screen: false,
// 		},
// 	},
// };

// export const SquareProductTC = composeWithJson(
// 	"SquareProduct",
// 	SquareProductModel
// );
// export const SquareProductGraphQLType = SquareProductTC.getType(); // GraphQLObjectType

// export const SquareProductITC = composeInputWithJson(
// 	"SquareProductInput",
// 	SquareProductModel
// );
// export const SquareProductGraphQLInput = SquareProductITC.getType(); // GraphQLInputObjectType
