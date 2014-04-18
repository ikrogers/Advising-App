require 'test_helper'

class CourselistsControllerTest < ActionController::TestCase
  setup do
    @courselist = courselists(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:courselists)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create courselist" do
    assert_difference('Courselist.count') do
      post :create, courselist: { description: @courselist.description, name: @courselist.name, prereq: @courselist.prereq }
    end

    assert_redirected_to courselist_path(assigns(:courselist))
  end

  test "should show courselist" do
    get :show, id: @courselist
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @courselist
    assert_response :success
  end

  test "should update courselist" do
    patch :update, id: @courselist, courselist: { description: @courselist.description, name: @courselist.name, prereq: @courselist.prereq }
    assert_redirected_to courselist_path(assigns(:courselist))
  end

  test "should destroy courselist" do
    assert_difference('Courselist.count', -1) do
      delete :destroy, id: @courselist
    end

    assert_redirected_to courselists_path
  end
end
