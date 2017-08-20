port module HorseApp exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode

main =
  Html.programWithFlags
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- MODEL

type alias Model =
    { accountID: Int
    }

type alias Flags =
    { accountID: Int
    }

type alias Tweet =
    { tid: String }

type alias ApiResponse =
    { results: List Tweet
    , audioSource: String
    }

-- UPDATE

type Msg = Reset
         | GiddyUp
         | Buck
         | Feed

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Reset -> (model, Cmd.none)
    _ -> (model, Cmd.none)


-- VIEW

view : Model -> Html Msg
view model =
    div []
    [ h2 [] [ text "account id: " ]
    , span [] [ text <| toString model.accountID ]
    ]


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


-- PORTS

-- ports for sending to js
port load : Int -> Cmd msg
port more : Int -> Cmd msg

-- port for listening for data from JavaScript
port neighs : (ApiResponse -> msg) -> Sub msg


-- HTTP

-- functions

init : Flags -> (Model, Cmd Msg)
init flags =
  ( Model flags.accountID
  , Cmd.none
  )

