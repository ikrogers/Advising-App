Advising::Application.routes.draw do
  resources :courselists
  post 'getcourse' => 'courses#getcourse'
  post 'contactf' => 'courses#contactf'
  resources :courses

  get "student/index"
  get 'admin' => 'admin#index'
  get 'advisor' => 'advisor#index'
  get 'student' => 'student#index'
  controller :sessions do
    get 'login' => :new
    post 'login' => :create
    delete 'logout' => :destroy
  end
  get "admin/index"
  get "sessions/new"
  get "sessions/create"
  get "sessions/destroy"
  resources :users

  controller :courses do
    get 'liftFlag' => :liftFlag
    get 'Lift Flag' => :liftFlag
  end
  
  resources :users do
    resources :courses
  end
  

  root 'advising#index', as: 'advising'
  
  
  
  

# The priority is based upon order of creation: first created -> highest priority.
# See how all your routes lay out with "rake routes".

# You can have the root of your site routed with "root"
# root 'welcome#index'

# Example of regular route:
#   get 'products/:id' => 'catalog#view'

# Example of named route that can be invoked with purchase_url(id: product.id)
#   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

# Example resource route (maps HTTP verbs to controller actions automatically):
#   resources :products

# Example resource route with options:
#   resources :products do
#     member do
#       get 'short'
#       post 'toggle'
#     end
#
#     collection do
#       get 'sold'
#     end
#   end

# Example resource route with sub-resources:
#   resources :products do
#     resources :comments, :sales
#     resource :seller
#   end

# Example resource route with more complex sub-resources:
#   resources :products do
#     resources :comments
#     resources :sales do
#       get 'recent', on: :collection
#     end
#   end

# Example resource route with concerns:
#   concern :toggleable do
#     post 'toggle'
#   end
#   resources :posts, concerns: :toggleable
#   resources :photos, concerns: :toggleable

# Example resource route within a namespace:
#   namespace :admin do
#     # Directs /admin/products/* to Admin::ProductsController
#     # (app/controllers/admin/products_controller.rb)
#     resources :products
#   end
end
