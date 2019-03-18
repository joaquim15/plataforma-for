import _ from 'underscore';
import React from "react";
import Messages from "forpdi/jsx/core/util/Messages.jsx";
import $ from "jquery";

export default React.createClass({

	getInitialState() {
		return {
			page: 1,
			pageSize: 5,
			pages: 0
		};
	},

	componentDidMount(){
		this.setState({
			pages: Math.ceil(this.props.totalofIncidents/this.state.pageSize)
		});
	},

	componentWillReceiveProps(newProps){
		this.setState({
			pages: Math.ceil(newProps.totalofIncidents/this.state.pageSize),
			page: (this.props.page !== undefined ? this.props.page : (this.state.page > Math.ceil(newProps.totalofIncidents/this.state.pageSize) ? 1 : this.state.page))
		});
	},

	loadPage(page, size){
		size = (isNaN(size) ? this.state.pageSize : size);
		page = (page > Math.ceil(this.props.totalofIncidents/size) ? Math.ceil(this.props.totalofIncidents/size) : page);
		this.props.onChangePage(page, size);
		this.state.page = page;
	},

	renderPages(){
		var max = Math.ceil(this.props.totalofIncidents/this.state.pageSize);
		var pages = [];
		if(max <= 5){
			for (var i = 1; i <= max; i++) {
				pages.push(
					<li key={"page-"+i} className={i === this.state.page ? "active" : ""}>
						<a onClick={this.loadPage.bind(this,i)} className="page-nr">
							{i}
						</a>
					</li>
				);
			}
			return pages;
		}

		var cont = 3, contN = 3;
		pages.push(this.state.page);
		pages.push(this.state.page-1 <= 0 ? this.state.page+(cont++): this.state.page-1);
		pages.push(this.state.page-2 <= 0 ? this.state.page+(cont): this.state.page-2);
		pages.push(this.state.page+1 > max ? this.state.page-(contN++): this.state.page+1);
		pages.push(this.state.page+2 > max ? this.state.page-(contN): this.state.page+2);
		pages.push(1);
		pages.push(2);
		pages.push(max);
		pages.push(max-1);

		var newPages = [];
		_.each(pages, (n) => {
			if(!_.contains(newPages, n)){
				newPages.push(n);
			}
		});
		newPages.sort(function(a, b){return a-b});
		pages = [];
		newPages.map((i, idx) => {
			if(idx > 0 && newPages[idx]-newPages[idx-1] > 1){
				pages.push(
					<li key={"pagex-"+i}>
						<a className="page_disabled page-nr">
							...
						</a>
					</li>
				);
			}
			pages.push(
				<li key={"page-"+i} className={i === this.state.page ? "active" : ""}>
					<a onClick={this.loadPage.bind(this,i)} className="page-nr">
						{i}
					</a>
				</li>
			);
		});

		return pages;
	},

	render() {
		if(this.props.totalofIncidents > 0){
			return(
				<div className="pagination-ctn">
					<nav aria-label="Page navigation" className="center">
						<ul className="pagination">
							<li>
								<a aria-label="Previous" className={this.state.page <= 1 ? "page_disabled page-nr" : "page-nr"}
								   onClick={this.state.page > 1 ? this.loadPage.bind(this,Number(this.state.page)-1) : _.noop}>
									<span aria-hidden="true">{Messages.get("label.previous")}</span>
								</a>
							</li>
							{this.renderPages()}
							<li>
								<a aria-label="Next" className={this.state.page >= this.state.pages ? "page_disabled page-nr" : "page-nr"}
								   onClick={this.state.page < this.state.pages ? this.loadPage.bind(this,Number(this.state.page)+1) : _.noop}>
									<span aria-hidden="true">{Messages.get("label.next")}</span>
								</a>
							</li>
						</ul>
					</nav>
				</div>
			);
		} else {
			return <div/>
		}
	}
})
