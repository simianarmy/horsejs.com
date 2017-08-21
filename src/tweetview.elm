port module TweetView exposing (..)

import Html exposing (Html, div, text, program, article)
import Html.Attributes as HA exposing (id)

-- MODEL

maxStyles = 48

type alias Tweet =
    { tid: String
    , words: List String
    }

type alias Model =
    { tweet: Maybe Tweet
    }

init : ( Model, Cmd Msg )
init =
    ( Model Nothing, Cmd.none )



-- MESSAGES


type Msg
    = NoOp



-- VIEW


view : Model -> Html Msg
view model =
    article [id "saddle"] [
        div [] [ div [ corralAttributes model ] [] ]
        , div [id "neigh"] []
        ]

corralAttributes : Model -> Html.Attribute msg
corralAttributes model =
    case model.tweet of
        Just t ->
            HA.style [ ("opacity", "0.5")
                  , ("class", saddleClass model)
                  ]
        Nothing ->
            HA.style [ ("opacity", "1") ]

saddleClass : Model -> String
saddleClass model =
    "harras1"

-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- MAIN


main : Program Never Model Msg
main =
    program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

