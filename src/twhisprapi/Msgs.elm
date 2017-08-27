module Msgs exposing (..)

import Models exposing (QueryOpts, ApiResponse)
import RemoteData exposing (WebData)

type Msg = Fetch String
    | Query QueryOpts
    | FetchRandom QueryOpts
    | OnFetchData (WebData ApiResponse)

