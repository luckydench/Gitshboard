export interface useGithubResult<T>{
    githubDataState : T | null;
    isLoading : boolean;
    isError : boolean;
}