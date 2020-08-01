import { sc } from "graphql-compose";
import { PaymentMutations } from "./PaymentSchema";

sc.Mutation.addFields({
    ...PaymentMutations,
});

const Schema = sc.buildSchema();

export default Schema;
