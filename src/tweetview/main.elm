module TweetView exposing (..)

import Array exposing (Array, get)
import Navigation exposing (Location)
import Routing
import View exposing (view)
import Msgs exposing (Msg)
import Models exposing (Model, initialModel)
import Update exposing (update)
import Ports exposing (addTweets)

-- MODEL

init : Location -> ( Model, Cmd Msg )
init location =
    let currentRoute = Routing.parseLocation location
    in
        -- TODO: ( initialModel currentRoute, fetchTweets )
        ( initialModel currentRoute, Cmd.none )


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
    [ addTweets Msgs.AddTweets ]


-- MAIN


main : Program Never Model Msg
main =
    Navigation.program Msgs.OnLocationChange
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

