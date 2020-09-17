import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';


// Import components
import Login from './components/Login.js';
import Table from './components/Table.js';
import Article from './components/Article.js';

function App() {
  return (<div>
            <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.css" />
            <BrowserRouter  >
              <Switch>
                <Route exact path="/" component={ Login }/>
                <Route path="/login" component={ Login }/>
                <Route path="/article" component={ Article }/>
                <Route path="/members" render={(routeProps) => ( <Table component={ Table }
                                                                        title="Members"
                                                                        tableName="All staff members"
                                                                        action="getMembers"
                                                                        headers={['firstname', 'lastname', 'email', 'isActive', 'department', 'teams']}
                                                                        triggerCols={{Delete: "deleteMember"}} />
                                              )} />
                <Route path="/archive" render={(routeProps) => ( <Table component={ Table }
                                                                        title="Archive"
                                                                        tableName="All inactive articles"
                                                                        action="getArchive"
                                                                        headers={['title', 'subject', 'type', 'status']}
                                                                        linkCols={{Open: "article?archive=true&id="}} />
                                              )} />
                
                <Route path="/articles" render={(routeProps) => ( <Table component={ Table }
                                                                        title="Articles"
                                                                        tableName="All active articles"
                                                                        action="getArticles"
                                                                        headers={['title', 'subject', 'type', 'editorEmails', 'timestamp', 'status']}
                                                                        linkCols={{Open: "article?id="}} />
                                              )} />
                <Route path="/finalReviewArticles" render={(routeProps) => ( <Table component={ Table }
                                                                        title="Final Review Articles"
                                                                        tableName="All final review articles"
                                                                        action="getFinalReviews"
                                                                        headers={['title', 'subject', 'type', 'editorEmails', 'timestamp', 'status']}
                                                                        linkCols={{Open: "article?id="}} />
                                              )} />
                <Route path="/getArticlesWPTeam" render={(routeProps) => ( <Table component={ Table }
                                                                        title="Articles to Publish"
                                                                        tableName="All articles to publish"
                                                                        action="getArticlesWPTeam"
                                                                        headers={['title', 'type', 'editorEmails', 'timestamp', 'status']}
                                                                        linkCols={{Open: "article?id="}} />
                                              )} />
              </Switch>
            </BrowserRouter>
          </div>
  );
}

export default App;