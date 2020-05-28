import React, { useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useToasts } from "react-toast-notifications";

/**
 * This simply fetches from our cache whether a recent update has occurred
 * TODO: CREATE FRAGMENTS / PLACE TO STORE ALL OF THESE SINCE THIS ONE IS ALSO IN ROUTES.JS
 */
const GET_RECENT_UPDATE = gql`
    query GetRecentUpdate {
        recentUpdate @client
    }
`

/**
 * Updates the user object field of recentUpdate
 */
const SEEN_RECENT_UPDATE = gql`
    mutation SeenRecentUpdate {
        userUpdateOne(record: { recentUpdate: false } ) {
            recordId
        }
    }
`

const Home = () => {
    // Check for recent update from cache
    let { data: storeData } = useQuery(GET_RECENT_UPDATE);
    let { recentUpdate } = storeData;

    // Need to be able to update recentUpdate field on the user when they dismiss
    let [ seenRecentUpdate, ] = useMutation(SEEN_RECENT_UPDATE);

    // Add toast
    let { addToast } = useToasts();

    useEffect(
        () => {
            if (recentUpdate) {
                let message = "Recent Update Message.";
                addToast(message, { appearance: 'info', onDismiss: () => seenRecentUpdate() });
            }
        }, [recentUpdate]
    )

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', position: 'relative', textAlign: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: "#FBFBFB" }}>
            <div style={{ display: "inline-block", color: "#272D2D" }}>
                <h3>Home Screen</h3>
            </div>
        </div>
    )
}

export default Home;