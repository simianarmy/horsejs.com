module TwisprApi exposing (..)

import Html exposing (Html, programWithFlags, div, text)
import Msgs exposing (Msg)
import Models exposing (Model, Flags, initialModel)
import Update exposing (update)
import Ports exposing (getTweet, getMore, getRandom)

main =
  Html.programWithFlags
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- MODEL

init : Flags -> (Model, Cmd Msg)
init flags =
  ( initialModel flags.accountId
  , Cmd.none
  )


-- VIEW

-- not much to do here :)
view : Model -> Html Msg
view model =
    div [] []


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
      [ getTweet Msgs.Fetch
      , getMore Msgs.Query
      , getRandom Msgs.FetchRandom
      ]


