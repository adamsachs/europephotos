class GalleriesController < ApplicationController
	def show
		galleryname = params[:id]
		render template: "galleries/#{galleryname}"
	end
end
