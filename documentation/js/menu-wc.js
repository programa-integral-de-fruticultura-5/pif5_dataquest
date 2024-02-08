'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">pif5_dataquest documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AutocompleteComponent.html" data-type="entity-link" >AutocompleteComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DataquestHeaderComponent.html" data-type="entity-link" >DataquestHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DateDataTypeComponent.html" data-type="entity-link" >DateDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetailedFormComponent.html" data-type="entity-link" >DetailedFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetailPage.html" data-type="entity-link" >DetailPage</a>
                            </li>
                            <li class="link">
                                <a href="components/DraftsPage.html" data-type="entity-link" >DraftsPage</a>
                            </li>
                            <li class="link">
                                <a href="components/DrawingPadDataTypeComponent.html" data-type="entity-link" >DrawingPadDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmailDataTypeComponent.html" data-type="entity-link" >EmailDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormListComponent.html" data-type="entity-link" >FormListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormsPage.html" data-type="entity-link" >FormsPage</a>
                            </li>
                            <li class="link">
                                <a href="components/HomePage.html" data-type="entity-link" >HomePage</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginPage.html" data-type="entity-link" >LoginPage</a>
                            </li>
                            <li class="link">
                                <a href="components/MoneyDataTypeComponent.html" data-type="entity-link" >MoneyDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MonthDataTypeComponent.html" data-type="entity-link" >MonthDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MultipleComponent.html" data-type="entity-link" >MultipleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NumberDataTypeComponent.html" data-type="entity-link" >NumberDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OpenComponent.html" data-type="entity-link" >OpenComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PercentageDataTypeComponent.html" data-type="entity-link" >PercentageDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PhoneDataTypeComponent.html" data-type="entity-link" >PhoneDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PhotoDataTypeComponent.html" data-type="entity-link" >PhotoDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/QuestionComponent.html" data-type="entity-link" >QuestionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SurveysPage.html" data-type="entity-link" >SurveysPage</a>
                            </li>
                            <li class="link">
                                <a href="components/TableComponent.html" data-type="entity-link" >TableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TextAreaDataTypeComponent.html" data-type="entity-link" >TextAreaDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TextDataTypeComponent.html" data-type="entity-link" >TextDataTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TypeaheadComponent.html" data-type="entity-link" >TypeaheadComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TypeComponent.html" data-type="entity-link" >TypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UniqueComponent.html" data-type="entity-link" >UniqueComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AnswerRelationService.html" data-type="entity-link" >AnswerRelationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AssociationService.html" data-type="entity-link" >AssociationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DetailedFormService.html" data-type="entity-link" >DetailedFormService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DraftService.html" data-type="entity-link" >DraftService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FormService.html" data-type="entity-link" >FormService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OfflineManagerService.html" data-type="entity-link" >OfflineManagerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhotoService.html" data-type="entity-link" >PhotoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProducerService.html" data-type="entity-link" >ProducerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuestionControlService.html" data-type="entity-link" >QuestionControlService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuestionService.html" data-type="entity-link" >QuestionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SecureInnerPagesGuard.html" data-type="entity-link" >SecureInnerPagesGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StorageService.html" data-type="entity-link" >StorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyService.html" data-type="entity-link" >SurveyService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Answer.html" data-type="entity-link" >Answer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnswerPivot.html" data-type="entity-link" >AnswerPivot</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnswerRelation.html" data-type="entity-link" >AnswerRelation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Association.html" data-type="entity-link" >Association</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthManagement.html" data-type="entity-link" >AuthManagement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Form.html" data-type="entity-link" >Form</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Producer.html" data-type="entity-link" >Producer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Question.html" data-type="entity-link" >Question</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuestionCategory.html" data-type="entity-link" >QuestionCategory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StoredRequest.html" data-type="entity-link" >StoredRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});