module Models exposing (..)

import RemoteData exposing (WebData)
import Json.Decode as Decode exposing (..)
import RemoteData exposing (WebData)

type alias ApiResponse =
    { results: List Decode.Value
    , audioSource: Maybe String
    , error: Maybe String
    }

type alias Model =
    { accountId: Int
    , results: WebData ApiResponse
    , lastId: String
    , lastError: String
    }

type alias Flags =
    { accountId: Int
    }

type alias QueryOpts =
    { limit: Maybe Int
    , maxId: Maybe String
    }

initialModel : Int -> Model
initialModel accountId =
    Model accountId RemoteData.Loading "" ""

