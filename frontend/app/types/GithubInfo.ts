/**
 * GitHub 사용자 정보를 나타내는 인터페이스입니다.
 * 
 * - id : GitHub 사용자 고유 ID
 * - login : GitHub 사용자 이름
 * - avatar_url : GitHub 사용자 아바타 이미지 URL
 * - html_url : GitHub 사용자 프로필 URL
 * - name : GitHub 사용자 이름 (실명)
 * - company : GitHub 사용자 회사 정보 (null 가능)
 * - blog : GitHub 사용자 블로그 URL (null 가능)
 * - location : GitHub 사용자 위치 정보 (null 가능)
 * - email : GitHub 사용자 이메일 (null 가능)
 * - bio : GitHub 사용자 소개 (null 가능)
 * - followers : GitHub 사용자 팔로워 수
 * - following : GitHub 사용자 팔로잉 수
 * 
 * 이 인터페이스는 GitHub API에서 반환되는 사용자 정보를 기반으로 정의되었습니다.
 * 
 * GitHub API 문서 : https://docs.github.com/en/rest/users/users#get-the-authenticated-user
 * 
 */
export interface GithubUser{
    id : number;
    login : string;
    avatar_url : string;
    html_url : string;
    name : string;
    company : string | null;
    blog : string | null;
    location : string | null;
    email : string | null;
    bio : string | null;
    followers : number;
    following : number;
}



/**
 * GitHub 저장소 정보를 나타내는 인터페이스입니다.
 * - id : 저장소 고유 ID
 * - name : 저장소 이름
 * - full_name : 저장소 전체 이름 (예: username/repo)
 * - private : 저장소 공개 여부 (true: 비공개, false: 공개)
 * - html_url : 저장소 웹 URL
 * - description : 저장소 설명 (null 가능)
 * - fork : 저장소가 포크인지 여부 (true: 포크, false: 원본)
 * - url : 저장소 API URL
 * - language : 저장소 주요 프로그래밍 언어 (null 가능)
 * - watchers : 저장소 감시자 수
 * 
 * 이 인터페이스는 GitHub API에서 반환되는 저장소 정보를 기반으로 정의되었습니다.
 * 
 * GitHub API 문서 : https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user
 * 
 */
export interface GithubRepo{
    id : number;
    name : string;
    full_name : string;
    private : boolean;
    html_url : string;
    description : string | null;
    fork : boolean;
    url : string;
    language : string | null;
    watchers : number;

}

export interface GithubRepositoryResponse{
    repos : GithubRepo[];
}